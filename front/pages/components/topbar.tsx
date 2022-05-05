import React, { useState, useEffect, SetStateAction } from 'react';
import { FaDotCircle, FaEthereum, FaWallet } from 'react-icons/fa';

import { Button, Link, Row } from "@nextui-org/react";

import { ethers, Provider } from "ethers";

import { WalletError } from '../../exceptions/walletError';
import { useUser } from "../../context/user";

const styles: any = {
  row: {
    background: "#ffffff",
    position: "fixed",
    width: "100%",
    zIndex: "10",
    height: "5rem",
    padding: "0 2rem",
    paddingLeft: "320px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 0.2rem 10px #e0e0e0"
  }
};

export default function TopBar({ onConnectWallet }) {
  const { user } = useUser();

  return (
    <Row
      css={styles.row}>
      <Link
        href="#"
        className="secondary-button"
      >
        <Button
          bordered
          color="success"
          size="xs"
        >
          <FaDotCircle /> &nbsp;
          Ethereum Rinkeby
        </Button>
      </Link>
      {user.account ?
        <div>
          <Button
            css={{ display: "inline-block" }}
            bordered
            color="primary"
            size="md"
          >
            <FaWallet />
            &nbsp;&nbsp;
            {user.account.substring(0, 15)}...
          </Button>
        </div>
        :
        <Button
          bordered
          color="primary"
          size="md"
          onClick={onConnectWallet}
        >
          <FaWallet />
          &nbsp;
          Connect your wallet
        </Button>
      }
    </Row>
  )
}
