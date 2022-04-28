import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import {WalletError} from '../../exceptions/walletError';
import { Button, Col, Input, Row } from '@nextui-org/react';

export default function WillForm() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthPostCode, setBirthPostCode] = useState("");
  const [heirAddress, setHeirAddress] = useState("");
  const [submit, setSubmit] = useState(false);
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      setSubmit(true);
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
          disabled={submit}
        >
          Bequeath your Eth
        </Button>
      </Row> 
    </Col>
  )
}
