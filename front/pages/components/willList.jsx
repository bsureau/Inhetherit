import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import {WalletError} from '../../exceptions/walletError';
import { Col, Row, Text } from '@nextui-org/react';

export default function WillList() {

  return (
    <Col
      css={{
        width: "85%",
        minWidth: "1000px",
        margin: "auto",
        borderRadius: "1rem",
        background: "#ffffff",
        marginTop: "3rem",
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
        <Text
          color="#b0b0b0"
        >
          NO WILL FOUND ON THIS ADDRESS...
        </Text>
      </Row> 
    </Col>
  )
}
