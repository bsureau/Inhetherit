import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import { WalletError } from '../../exceptions/walletError';
import { Button, Link, Row, Spacer } from "@nextui-org/react";
import { FaDotCircle, FaEthereum, FaWallet } from 'react-icons/fa';
import { store } from '../../store';
import { ExternalProvider } from "@ethersproject/providers";

const styles = {
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

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
};

export default function TopBar() {
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // TODO: refacto en utilisant Redux
  const checkIfWalletIsConnected = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) { // Make sure you have Metamask
        setConnected(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum); // Connect to Ethereum using MetaMask
      const accounts = await provider.send("eth_accounts", []); // Retrieve authorized accounts

      if (accounts.length > 0) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await signer.getBalance();
        setSigner(signer);
        setProvider(provider);
        setBalance(balance);
        setAccount(address);
        setConnected(true);

        ethereum.on('accountsChanged', async () => {
          checkIfWalletIsConnected();
        });

        provider.on('block', async () => {
          if (account === "") return;
          const balance = await provider.getBalance(signer.getAddress());
          setBalance(balance);
        });

        store.dispatch(
          {
            type:"INIT_WALLET",
            wallet: {
              account: account,
              balance: balance,
              signer: signer
            }
          }
        );

      } else { // Need to request permission to connect users account firs (see connectWallet method)
        setConnected(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) { // Make sure you have Metamask
        setConnected(false);
        throw new WalletError("Please install Metamask first: https://metamask.io");
      }

      const provider = new ethers.providers.Web3Provider(ethereum); // Connect to Ethereum using MetaMask
      await provider.send("eth_requestAccounts", []); // Requesting permission to connect users accounts
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await signer.getBalance();
      setAccount(address);
      setBalance(balance);
      setConnected(true);

      ethereum.on('accountsChanged', async () => {
        checkIfWalletIsConnected();
      });

    } catch (error) {
      console.log(error);
      let message;
      if (error instanceof WalletError) {
        message = error.message;
      } else {
        message = "Can't connect to Metamask. Please try again or contact our support."
      }
      alert(message);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
      {isConnected ?
        <div>
          <Button
            css={{ display: "inline-block", minWidth: 0, marginRight: 10 }}
            bordered
            color="black"
            size="md"
          >
            <FaEthereum />
            &nbsp;
            {Math.round(ethers.utils.formatEther(balance) * 100) / 100} ETH
          </Button>
          <Button
            css={{ display: "inline-block" }}
            bordered
            color="primary"
            size="md"
          >
            <FaWallet />
            &nbsp;&nbsp;
            {account.substring(0, 15)}...
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
