import React, { useState, useEffect } from 'react';
import { Button, Col, Input, Link, Modal, Row, Spacer, Text } from '@nextui-org/react';

export default function WillForm() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthPostCode, setBirthPostCode] = useState("");
  const [heirAddress, setHeirAddress] = useState("");
  const [submit, setSubmit] = useState(false);
  
  const isValid = () => {
    if (firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      return true
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (firstName.trim() !== "" && lastName.trim() !== ""  && birthdayDate.trim() !== ""  && birthPostCode.trim() !== ""  && heirAddress.trim() !== "") {
      setSubmit(true);
    }
  }

  const handleWill = () => {
    alert("coucou");
    //TODO: interact with contract
  }

  const handleClose = () => {
      setSubmit(false);
  }

  return (
    <Col
      css={{
        width: "85%",
        minWidth: "1000px",
        margin: "auto",
        borderRadius: "1rem",
        backgroundColor: "#ffffff",
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
          width="200px" 
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          disabled={submit}
        />
        <Input 
          rounded
          bordered
          label="Last name:"
          placeholder="Bono"
          color="primary" 
          width="200px" 
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          disabled={submit}
        />
        <Input 
          rounded
          bordered
          label="Birthday date:"
          placeholder="07/12/1990"
          color="primary"
          width="150px" 
          value={birthdayDate}
          onChange={e => setBirthdayDate(e.target.value)}
          disabled={submit}
        />
        <Input 
          rounded
          bordered
          label="Birth post code:"
          placeholder="75012"
          color="primary" 
          width="150px" 
          value={birthPostCode}
          onChange={e => setBirthPostCode(e.target.value)}
          disabled={submit}
        />
        <Input 
          rounded
          bordered
          label="Heir address"
          placeholder="0x..."
          color="primary" 
          width="400px" 
          value={heirAddress}
          onChange={e => setHeirAddress(e.target.value)}
          disabled={submit}
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
          disabled={!isValid() || (isValid() && submit)}
        >
          Bequeath your Eth
        </Button>
      </Row> 
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={submit}
        onClose={handleClose}
      >
        <Modal.Header>
          <Text id="modal-title" size={30}>
            Confirm your will
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Col justify="center" align="center">
            <Text>
              You are about to give the right to transfer all your Eth funds to your heir. <br/>
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
          <Button auto flat color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button auto onClick={handleWill}>
            Yes, I confirm!
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  )
}
