import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Col, Input, Link, Modal, Row, Spacer, Text, textWeights } from '@nextui-org/react';

import { Contract, ethers } from 'ethers';

import { store } from '../../store';
import { User } from '../../types';
import { FaCheck } from 'react-icons/fa';

export default function WillForm() {

  const [firstName, setFirstName]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [lastName, setLastName]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [birthdayDate, setBirthdayDate]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [birthPostCode, setBirthPostCode]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [heirAddress, setHeirAddress]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [submited, setSubmited]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [openReviewInfo, setOpenReviewInfo]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [metamaskInfo, setMetamaskInfo] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  
  const isValid: Function = () => {
    if (firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      return true
    }
  }

  const handleSubmit: Function = (evt) => {
    evt.preventDefault();
    if (firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      setSubmited(true);
      setOpenReviewInfo(true);
    }
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
    const inheritWillABI: string[] = [
      "function cancel() public returns(uint8)",
    ];
    const willContract: Contract = new ethers.Contract(inheritWillAddress, inheritWillABI, wallet.signer);
    const txWill = await willContract.cancel();

    const txCancelReceipt: TransactionReceipt = await txWill.wait(1);
    console.log('Will canceled', txCancelReceipt);

    setLoading(false);
    setConfirmation(true);

    // ici notre contrat est mint, donc on peu mettre a jour le state local pour changer
    // la modal, demander le droit d'approve, virer le loading etc...

    // TODO: gérer les erreurs
    // TODO: gérer l'annulation via Metamask par l'utilisateur

    //TODO: interact with contract
    // 1. call approve on Ethereum smart contract
    // 2. save will informations in inhetherit smart contract
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
        justify="center"
        css={{
          flexWrap: "wrap",
          justifyContent: "space-around",
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
          Pass on your ETH
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
