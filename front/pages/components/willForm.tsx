import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Col, Input, Link, Modal, Row, Spacer, Text, textWeights } from '@nextui-org/react';

import { Contract, ethers } from 'ethers';

import { store } from '../../store';
import { User } from '../../types';
import { FaCheck } from 'react-icons/fa';

export default function WillForm() {

  const erc20Addresses = {
    //'ETH': '',
    'WETH': '0xdf032bc4b9dc2782bb09352007d4c57b75160b15',
    'LINK': '0x01be23585060835e02b77ef475b0cc51aa1e0709'
  };

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

  // validation funnel
  const [openReviewInfo, setOpenReviewInfo]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [metamaskInfo, setMetamaskInfo] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [approve, setApprove] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const handleChangeToken = async (event) => {
    setToken(event.target.value);
    setErc20Address(erc20Addresses[event.target.value]);
    setTokenBalance('...');

    const wallet: User = store.getState().user;
    const contract: Contract = new ethers.Contract(erc20Addresses[event.target.value], [
      'function balanceOf(address _owner) public view returns(uint256)'
    ], wallet.signer);
    const balance = await contract.balanceOf(wallet.account);
    setTokenBalance(`${ethers.utils.formatEther(balance)}`);
  }

  const isValid: Function = () => {
    if (erc20Address.trim() !== "" && firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      return true
    }
  }

  const handleSubmit: Function = (evt) => {
    evt.preventDefault();
    if (erc20Address.trim() !== "" && firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      setSubmited(true);
      setOpenReviewInfo(true);
    }
  }

  async function approveTransfer(inhetheritWillAddress: string) {

    const erc20Abi = [
      "function approve(address _spender, uint256 _value) public returns (bool success)"
    ];
  
    const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, store.getState().user.signer);
  
    const tx = await erc20Contract.approve(inhetheritWillAddress, ethers.utils.parseUnits("2", 18)); //replace value by max uint256 value

    const txReceipt: TransactionReceipt = await tx.wait(1);

    console.log('Approve ok: ', txReceipt);
  }

  const handleWill: Function = async () => {
    const inhetheritFactoryAddress: string = "0x0a0B1eA109042C8C85576a5f3B86e4912944e3e4";
    const inhetheritFactoryABI: string[] = [
      "function createWill(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) public returns(address)",
      "function getWill() public view returns(address)",
    ];

    // we display loading once user has validated transaction with metamask
    setOpenReviewInfo(false);
    setMetamaskInfo(true);

    const wallet: User = store.getState().user;
    const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, wallet.signer);
    const tx: TransactionResponse = await contract.createWill(firstName, lastName, birthdayDate, birthPostCode, heirAddress);

    // we display loading once user has validated transaction with metamask
    setMetamaskInfo(false);
    setLoading(true);

    // wait at least 3 block mined before saying all good
    const txReceipt: TransactionReceipt = await tx.wait(1);

    console.log('Will created', txReceipt);

    const inheritWillAddress: string = await contract.getWill();

    setLoading(false);

    setApprove(true);
    await approveTransfer(inheritWillAddress);

    setApprove(false);
    setConfirmation(true);

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
            flexWrap: "wrap",
            justifyContent: "flex-start",
            textAlign:"left",
            padding: "3rem 3rem 0rem 3rem"
          }}
        >
          <select value={token} onChange={handleChangeToken}>
            <option value='' disabled defaultChecked>Select the token you want to transfer</option>
            <option value='ETH'>Ethereum</option>
            <option value='WETH'>Wrapped Ethereum</option>
            <option value='LINK'>Chainlink</option>
          </select>
          {/* <Input
            rounded
            bordered
            label="ERC-20 address:"
            placeholder="0x..."
            color="primary"
            width="30%"
            value={erc20Address}
            onChange={e => setErc20Address(e.target.value)}
            disabled={submited}
          /> */}
        </Row>
        <Row
          css={{
            flexWrap: "wrap",
            justifyContent: "flex-start",
            textAlign: "left",
            padding: "1rem 0rem 0rem 3rem"
          }}
        >
          {token != '' ? (
            <>
              Current balance: &nbsp;<b>{tokenBalance} {token}</b>
            </>
          ) : ''}
        </Row>
        <Row
          css={{
            flexWrap: "wrap",
            justifyContent: "flex-start",
            textAlign:"left",
            padding: "3rem"
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
      </Row> 
      <Row 
        justify="center"
        css={{
          justifyContent: "space-around",
          textAlign:"left",
          paddingBottom: "2rem"
        }}
      >
       <Button 
          bordered 
          color="primary" 
          size="lg" 
          onClick={handleSubmit}
          disabled={!isValid() || (isValid() && submited)}
        >
          Pass on your cryptos
        </Button>
      </Row> 

      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={openReviewInfo}
        onClose={() => setOpenReviewInfo(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Confirm your will
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Col justify="center" align="center">
            <Text>
              You are about to give the right to transfer all your Eth funds to your heir. <br />
              Please make sure all the informations are correct or your funds could never be transferred at the time of your death.
            </Text>
            <Spacer />
            <Text>
              <strong>First name:</strong>
              <br />
              {firstName}
            </Text>
            <Spacer />
            <Text>
              <strong>Last name:</strong>
              <br />
              {lastName}
            </Text>
            <Spacer />
            <Text>
              <strong>Birthday date:</strong>
              <br />
              {birthdayDate}
            </Text>
            <Spacer />
            <Text>
              <strong>Birth postal code:</strong>
              <br />
              {birthPostCode}
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
          <Button auto flat color="error" onClick={() => setOpenReviewInfo(false)}>
            Cancel
          </Button>
          <Button auto onClick={handleWill}>
            Yes, I confirm!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        preventClose={true}
        aria-labelledby="modal-title"
        width="600px"
        open={metamaskInfo}
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
        open={isLoading}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Uploading your will...
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            Your will is being uploaded... It may take a few minutes...
          </Text>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        preventClose={true}
        aria-labelledby="modal-title"
        width="600px"
        open={approve}
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
        open={confirmation}
        onClose={() => setConfirmation(false)}
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
    </Col>
  )
}
