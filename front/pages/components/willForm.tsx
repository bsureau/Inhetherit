import React, {Dispatch, SetStateAction, useState} from 'react';
import {Button, Col, Input, Link, Modal, Row, Spacer, Text, textWeights, Tooltip} from '@nextui-org/react';

import {BigNumber, Contract, ethers, FixedNumber} from 'ethers';
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import {FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes} from 'react-icons/fa';
import { useUser } from "../../context/user";
import { useWill } from "../../context/will";
import {
  getWill,
  inhetheritFactoryABI,
  inhetheritFactoryAddress
} from "../../utils/willContract";
import {
  erc20Abi,
  erc20Addresses,
  getBalanceOf,
  maxUINT256
} from "../../utils/erc20Contract";

export default function WillForm() {
  const { user } = useUser();
  const { will, setWill } = useWill();

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
  const [openModal, setOpenModal] = useState('');
  const MODAL_REVIEW = 'review-informations';
  const MODAL_METAMASK_VALIDATE = 'metamask-validate';
  const MODAL_LOADING = 'loading';
  const MODAL_METAMASK_APPROVE = 'metamask-approve';
  const MODAL_CONFIRMATION = 'confirmation';
  const MODAL_ERROR = 'error';

  const handleChangeToken = async (event) => {
    setToken(event.target.value);
    setErc20Address(erc20Addresses[event.target.value]);
    setTokenBalance('...');

    let balance: BigNumber;
    if (event.target.value == 'ETH') {
      balance = await user.signer.getBalance();
    } else {
      balance = await getBalanceOf(user, erc20Addresses[event.target.value]);
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
    setOpenModal(MODAL_REVIEW);
  }

  async function approveTransfer(inhetheritWillAddress: string) {
    const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
    return await erc20Contract.approve(inhetheritWillAddress, maxUINT256); //replace value by max uint256 value
  }

  async function createWill() {
    const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);

    if (will != undefined) {
      if (erc20Address == 'eth') {
        console.log('Add ETH to will');
        return await contract.addEth(
          heirAddress,
          {
            value: BigNumber.from(tokenToTransfer.toHexString())
          }
        );
      }

      console.log('Add ERC20 token to will');
      return await contract.addErc20Token(
        heirAddress,
        erc20Address
      );
    }

    if (erc20Address == 'eth') {
      console.log('Create will with ETH');
      return await contract.createWillWithEth(
        firstName,
        lastName,
        birthdayDate,
        birthPostCode,
        heirAddress
      );
    }

    console.log('Create will with ERC20');
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
    setOpenModal(MODAL_METAMASK_VALIDATE);

    let willTx: TransactionResponse;
    try {
      willTx = await createWill();
    } catch(error) {
      // TODO: handle errors in case will already exists or token already given
      setOpenModal(MODAL_ERROR);
      console.error(error);
      return;
    }

    // we display loading once user has validated transaction with metamask
    setOpenModal(MODAL_LOADING);

    // wait that the block containing our transaction is mined to move forward
    await willTx.wait(1);

    setOpenModal(MODAL_METAMASK_APPROVE);

    if (erc20Address == 'eth') {
      setOpenModal(MODAL_LOADING);
    } else {
      let approveTx: TransactionResponse;
      try {
        const tempWill = await getWill(user);
        approveTx = await approveTransfer(tempWill.address);
      } catch(error) {
        setOpenModal(MODAL_ERROR);
        console.error(error);
        return;
      }

      setOpenModal(MODAL_LOADING);

      await approveTx.wait(1);
    }

    setWill(await getWill(user));

    setOpenModal(MODAL_CONFIRMATION);

    // reset form
    setTokenToTransfer(FixedNumber.from('0.0'));
    setHeirAddress('');

    // update current balance
    await handleChangeToken({ target: { value: token }});
  }

  const onCloseModal = () => {
    //setOpenModal('');
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
            padding: "3rem 3rem 0rem 3rem"
          }}
        >
            <Col 
              css= {{
                width: "auto",
                marginRight: "1.5%"
              }}
            >
              <Text style={{ marginLeft: "5px", marginBottom: "4px", color: '#3985f6', fontSize: 14 }}>Token:</Text>
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
                <option value='' disabled defaultChecked>Select the token you want to transfer 🔽 &nbsp;</option>
                <option value='ETH'>Ethereum (ETH)</option>
                <option value='WETH'>Wrapped Ethereum (WETH)</option>
                <option value='LINK'>Chainlink (LINK)</option>
              </select>
            </Col>
            { token == 'ETH' &&
              <Input
                rounded
                bordered
                type="number"
                label="ETH to pass on"
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
                label="Heir address"
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
              Current balance: &nbsp;<b>{tokenBalance} {token}</b> &nbsp;
              {token == 'ETH' &&
                <>
                  <Tooltip content={`Estimated gas price: ${ethers.utils.formatEther(gasPrice)} ETH`}>
                    <FaInfoCircle style={{verticalAlign: 'bottom'}} color="#dbdbdb" size={17}/>
                  </Tooltip>
                  <Text css={{ paddingTop: 10 }} color="warning">
                    <FaExclamationTriangle size={20} style={{ verticalAlign: 'top' }}/> Since ETH is not ERC20 compliant the amount you decide to pass on will be locked on the contract <small>(you can unlock it by deleting the will)</small>
                  </Text>
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
                label="Heir address"
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
          padding: "1rem 3rem 0rem"
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
      <Row css={{
        justifyContent: "flex-start",
        textAlign:"left",
        padding: "1rem 3rem 3rem"
      }}>
        { will ?
          <Text css={{ display: 'block' }}>Your will address: <Link href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank">{will.address}</Link></Text>
          : ''}
      </Row>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_REVIEW}
        onClose={onCloseModal}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Confirm your will
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Col justify="center" align="center">
            <Text>
              You are about to give the right to transfer all your {token} funds to your heir. <br />
              Please make sure all the informations are correct or your funds could never be transferred at the time of your death.
            </Text>
            <Spacer />
            <Text>
              <strong>First name:</strong>
              <br />
              {firstName == '' && will ? will.firstName : firstName}
            </Text>
            <Spacer />
            <Text>
              <strong>Last name:</strong>
              <br />
              {lastName == '' && will ? will.lastName : lastName}
            </Text>
            <Spacer />
            <Text>
              <strong>Birthday date:</strong>
              <br />
              {birthdayDate == '' && will ? will.birthdate : birthdayDate}
            </Text>
            <Spacer />
            <Text>
              <strong>Birth postal code:</strong>
              <br />
              {birthPostCode == '' && will ? will.postCode : birthPostCode}
            </Text>
            <Spacer />
            <Text>
              <strong>Heir address:</strong>
              <br />
              <Link
                href={`https://rinkeby.etherscan.io/search?f=1&q=${heirAddress}`}
                target="_blank"
              >
                {heirAddress}
              </Link>
            </Text>
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button auto onClick={handleWill}>
            Yes, I confirm!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        preventClose={true}
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_METAMASK_VALIDATE}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Confirm the transaction
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            You need to confirm the transaction using metamask
          </Text>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        preventClose={true}
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_LOADING}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Loading...
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            Your will is being uploaded... <br/>
            It may take a few minutes...
          </Text>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        preventClose={true}
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_METAMASK_APPROVE}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Last step
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            You must now approve transfer of your token by your will smart contract 
          </Text>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_CONFIRMATION}
        onClose={onCloseModal}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center" }}>
            <FaCheck size={80} color="#16a085" style={{ display: "inline-block" }} />
          </span>
          <Text size={30}>
            All good
          </Text>
          Your will is now on your wallet and will be executed when you die.
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={openModal == MODAL_ERROR}
        onClose={onCloseModal}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center" }}>
            <FaTimes size={80} color="#96281b" style={{ display: "inline-block" }} />
          </span>
          <Text size={30}>
            Oops
          </Text>
          Something went wrong here...<br/>
          <code>
            blablablablabla
          </code>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </Col>
  )
}
