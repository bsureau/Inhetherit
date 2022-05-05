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

export default function TopBar() {
  const { user, setUser } = useUser();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) { // Make sure you have Metamask
        setUser({});
        throw new WalletError("Please install Metamask first: https://metamask.io");
      }

      const provider: Provider = new ethers.providers.Web3Provider(ethereum); // Connect to Ethereum using MetaMask
      await provider.send("eth_requestAccounts", []); // Requesting permission to connect users accounts
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await signer.getBalance();

      ethereum.on('accountsChanged', async () => {
        // TODO: update wallet
      });

      setUser({
        account: address,
        balance: balance,
        signer: signer
      });

    } catch (error) {
      let message;
      if (error instanceof WalletError) {
        message = error.message;
      } else {
        message = "Can't connect to Metamask. Please try again or contact our support."
      }
      console.log(message, error);
      // TODO: Display modal
    }
  };

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
          onClick={connectWallet}
        >
          <FaWallet />
          &nbsp;
          Connect your wallet
        </Button>
      }
    </Row>
  )
}
