import React, {Dispatch, SetStateAction, useState} from 'react';
import {Button, Col, Input, Row, Spacer, Text, Tooltip} from '@nextui-org/react';

import {BigNumber, Contract, ethers, FixedNumber} from 'ethers';
import { TransactionResponse } from "@ethersproject/abstract-provider";

import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useUser } from "../../context/user";
import { useWill } from "../../context/will";
import { useModal } from "../../context/modal";

import {
  getWill,
  inhetheritFactoryABI,
  inhetheritFactoryAddress
} from "../../utils/willContract";
import {
  erc20Abi,
  getAddressFromToken,
  getBalanceOf,
  getErc20Iso3FromAddress,
  isERC20Token,
  maxUINT256ForToken
} from "../../utils/erc20Contract";

import {
  ConfirmationModal,
  ErrorModal,
  LoadingModal,
  MetamaskApproveModal,
  MetamaskConfirmModal,
  ReviewModal
} from "./modals";

export default function WillForm() {
  const { user } = useUser();
  const { will, setWill } = useWill();
  const { modal, setModal } = useModal();

  // form
  const [firstName, setFirstName]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [lastName, setLastName]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [birthdayDate, setBirthdayDate]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [birthPostCode, setBirthPostCode]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [heirAddress, setHeirAddress]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [submited, setSubmited]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

  // token
  const [token, setToken] = useState('');
  const [erc20Address, setErc20Address]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenToTransfer, setTokenToTransfer] = useState(FixedNumber.from(0));
  const [gasPrice, setGasPrice] = useState(BigNumber.from(0));

  // validation funnel
  const MODAL_REVIEW = 'form-review-informations';
  const MODAL_METAMASK_VALIDATE = 'form-metamask-validate';
  const MODAL_LOADING = 'form-loading';
  const MODAL_METAMASK_APPROVE = 'form-metamask-approve';
  const MODAL_CONFIRMATION = 'form-confirmation';
  const MODAL_ERROR = 'form-error';

  const handleChangeToken = async (event) => {
    setToken(event.target.value);
    setErc20Address(getAddressFromToken(event.target.value));
    setTokenBalance('...');

    let balance: BigNumber;
    if (!isERC20Token(event.target.value)) {
      balance = await user.signer.getBalance();
    } else {
      balance = await getBalanceOf(user, getAddressFromToken(event.target.value));
      setGasPrice(await user.signer.provider.getGasPrice());
    }

    setTokenBalance(`${ethers.utils.formatEther(balance)}`);
  }

  const isValid: Function = () => {
    // if there is no will yet
    if (!will) {
      if (erc20Address.trim() !== "" && firstName.trim() !== "" && lastName.trim() !== "" && birthdayDate.trim() !== "" && birthPostCode.trim() !== "" && heirAddress.trim() !== "") {
        return true
      }
    } else {
      if (erc20Address.trim() !== "" && heirAddress.trim() !== "") {
        return true
      }
    }
  }

  const handleSubmit: Function = (evt) => {
    evt.preventDefault();
    setSubmited(true);

    setModal({
      open: MODAL_REVIEW,
      data: {
        token: token,
        tokenToTransfer: tokenToTransfer,
        firstName: firstName == '' && will ? will.firstName : firstName,
        lastName: lastName == '' && will ? will.lastName : lastName,
        birthday: birthdayDate == '' && will ? will.birthday : birthdayDate,
        birthPostCode: birthPostCode == '' && will ? will.postCode : birthPostCode,
        heirAddress: heirAddress,
      },
    });
  }

  async function approveTransfer(inhetheritWillAddress: string) {
    const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
    return await erc20Contract.approve(inhetheritWillAddress, maxUINT256ForToken(getErc20Iso3FromAddress(erc20Address)));
  }

  async function createWill() {
    const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);

    if (will != undefined) {
      if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
        return await contract.addEth(
          heirAddress,
          {
            value: BigNumber.from(tokenToTransfer.toHexString())
          }
        );
      }

      return await contract.addErc20Token(
        heirAddress,
        erc20Address
      );
    }

    if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
      return await contract.createWillWithEth(
        firstName,
        lastName,
        birthdayDate,
        birthPostCode,
        heirAddress,
        {
          value: BigNumber.from(tokenToTransfer.toHexString())
        }
      );
    }

    return await contract.createWill(
      firstName,
      lastName,
      birthdayDate,
      birthPostCode,
      erc20Address,
      heirAddress
    );
  }

  const handleWill: Function = async () => {
    setModal({
      open: MODAL_METAMASK_VALIDATE,
      data: {}
    });

    let willTx: TransactionResponse;
    try {
      willTx = await createWill();
    } catch(error) {
      // TODO: handle errors in case will already exists or token already given
      setModal({
        open: MODAL_ERROR,
        data: {
          text: will ? 'We could not add token to your will' : 'We could not create your will',
          error: error,
        }
      });
      return;
    }

    // we display loading once user has validated transaction with metamask
    setModal({
      open: MODAL_LOADING,
      data: {
        text: will ? 'We are adding your '+ token +' to your will on the blockchain, this might take a few minutes...' : 'We are uploading your will on the blockchain, this might take a few minutes...'
      }
    });

    // wait that the block containing our transaction is mined to move forward
    await willTx.wait(3);

    setModal({
      open: MODAL_METAMASK_APPROVE,
      data: {}
    });

    if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
      setModal({
        open: MODAL_LOADING,
        data: {
          text: 'Final checks, making sure all is in order...'
        }
      });
    } else {
      let approveTx: TransactionResponse;
      try {
        const tempWill = await getWill(user);
        approveTx = await approveTransfer(tempWill.address);
      } catch(error) {
        setModal({
          open: MODAL_ERROR,
          data: {
            text: 'We could not approve the transfer. You will have to do it manually later in the list.',
            error: error,
          }
        });
        setWill(await getWill(user));
        return;
      }

      setModal({
        open: MODAL_LOADING,
        data: {
          text: 'Final checks, making sure all is in order...'
        }
      });

      await approveTx.wait(1);
    }

    const isCreation = !will;
    setWill(await getWill(user));

    setModal({
      open: MODAL_CONFIRMATION,
      data: {
        text: isCreation ? 'Your will has successfully been created.' : 'Your '+ token +' has been successfully added to your will'
      }
    });

    // reset form
    setTokenToTransfer(FixedNumber.from('0.0'));
    setHeirAddress('');

    // update current balance
    await handleChangeToken({ target: { value: token }});
  }

  const onCloseModal = () => {
    /*setModal({
      open: undefined,
      data: {}
    });*/
    setSubmited(false);
  }

  return (
    <Col
      css={{
        width: "85%",
        minWidth: "1000px",
        margin: "auto",
        borderRadius: "1rem",
        background: "#ffffff",
        boxShadow: "0px 0.2rem 10px #e0e0e0"
      }}
    >
      <Row 
        css={{
          flexWrap: "wrap",
        }}
      >
        <Row
          css={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign:"left",
            padding: "2rem 3rem 0rem 3rem"
          }}
        >
            <Col 
              css= {{
                width: "auto",
                marginRight: "1.5%"
              }}
            >
              <Text style={{ marginLeft: "5px", marginBottom: "4px", color: '#0070f3', fontSize: 14 }}>Token: </Text>
              <select
                value={token}
                onChange={handleChangeToken}
                style={{
                  appearance: 'none',
                  padding: "8px 20px",
                  borderRadius: '30px',
                  border: 'solid 2px #EAEAEA',
                  color: '#757575',
                  cursor: 'pointer',
                }}
              >
                <option value='' disabled defaultChecked>Select a token 🔽 &nbsp;</option>
                <option value='ETH'>Ethereum (ETH)</option>
                <option value='LINK'>Chainlink (LINK)</option>
                <option value='USDT'>Tether Token (USDT)</option>
                <option value='USDC'>USD Coin (USDC)</option>
                <option value='BNT'>Bancor Network Token (BNT)</option>
                <option value='WBTC'>Wrapped Bitcoin (WBTC)</option>
                <option value='WETH'>Wrapped Ethereum (WETH)</option>
              </select>
            </Col>
            { token == 'ETH' &&
              <Input
                rounded
                bordered
                type="number"
                label="ETH to pass on:"
                placeholder="0.0"
                color="primary"
                width="20%"
                css={{ paddingRight: "20px" }}
                min="0.0"
                value={tokenToTransfer}
                onChange={e => setTokenToTransfer(FixedNumber.from(e.target.value == '' ? 0.0 : e.target.value))}
                disabled={submited}
              />
            }
            { will &&
              <Input 
                rounded
                bordered
                label="Heir address:"
                placeholder="0x..."
                color="primary" 
                width="30%" 
                value={heirAddress}
                onChange={e => setHeirAddress(e.target.value)}
                disabled={submited}
            />
          }
        </Row>
        <Row
          css={{
            flexWrap: "wrap",
            justifyContent: "flex-start",
            textAlign: "left",
            padding: "1rem 0rem 1rem 3rem"
          }}
        >
          {token != '' ? (
            <>
              <Text css={{ paddingTop: 10 }}>
                Current balance: &nbsp;<b>{tokenBalance} {token}</b> &nbsp;
              </Text>
              {token == 'ETH' &&
                <>
                  <Tooltip content={`Estimated gas price: ${ethers.utils.formatEther(gasPrice)} ETH`}>
                    <FaInfoCircle style={{verticalAlign: 'bottom'}} color="#dbdbdb" size={17}/>
                  </Tooltip>
                  <Row>
                    <Text css={{ paddingTop: "15px" }} color="warning">
                      <FaExclamationTriangle size={20} style={{ verticalAlign: 'top' }}/> Since ETH is not ERC20 compliant, the amount you decide to pass on will be locked on the contract <small>(you can unlock it by deleting the token from the will)</small>
                    </Text>
                  </Row>
                </>
              }
            </>
          ) : ''}
        </Row>
        { !will &&
          <>
            <Row
              css={{
                flexWrap: "wrap",
                justifyContent: "flex-start",
                textAlign:"left",
                padding: "1rem 3rem 3rem 3rem"
              }}
            >
              <Input 
                rounded
                bordered
                label="First name:"
                placeholder="Jean"
                color="primary" 
                width="15%" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={submited}
              />
              <Spacer x={1} />
              <Input 
                rounded
                bordered
                label="Last name:"
                placeholder="Bono"
                color="primary" 
                width="15%" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={submited}
              />
              <Spacer x={1} />
              <Input 
                rounded
                bordered
                label="Birthday date:"
                placeholder="07/12/1990"
                color="primary"
                width="15%" 
                value={birthdayDate}
                onChange={e => setBirthdayDate(e.target.value)}
                disabled={submited}
              />
              <Spacer x={1} />
              <Input 
                rounded
                bordered
                label="Birth post code:"
                placeholder="75012"
                color="primary" 
                width="15%" 
                value={birthPostCode}
                onChange={e => setBirthPostCode(e.target.value)}
                disabled={submited}
              />
              <Spacer x={1} />
              <Input 
                rounded
                bordered
                label="Heir address:"
                placeholder="0x..."
                color="primary" 
                width="30%" 
                value={heirAddress}
                onChange={e => setHeirAddress(e.target.value)}
                disabled={submited}
              />
            </Row>
          </>
        }
      </Row> 
      <Row 
        justify="center"
        css={{
          justifyContent: "flex-start",
          textAlign:"left",
          padding: "0rem 3rem 2rem"
        }}
      >
       <Button
          bordered
          color="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid() || (isValid() && submited)}
        >
          {will ? 'Add to your will' : 'Create your will'}
        </Button>
      </Row>

      <ReviewModal
        isOpened={modal.open == MODAL_REVIEW}
        onCloseModal={onCloseModal}
        handleWill={handleWill}
        formData={modal.data}
      />
      <MetamaskConfirmModal isOpened={modal.open == MODAL_METAMASK_VALIDATE} />
      <MetamaskApproveModal isOpened={modal.open == MODAL_METAMASK_APPROVE} />
      <LoadingModal
        isOpened={modal.open == MODAL_LOADING}
        text={modal.data.text}
      />
      <ConfirmationModal
        isOpened={modal.open == MODAL_CONFIRMATION}
        onCloseModal={onCloseModal}
        text={modal.data.text} />
      <ErrorModal
        isOpened={modal.open == MODAL_ERROR}
        onCloseModal={onCloseModal}
        text={modal.data.text}
        error={modal.data.error}
      />
    </Col>
  )
}
