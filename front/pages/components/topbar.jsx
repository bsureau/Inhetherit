import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import {WalletError} from '../../exceptions/walletError';
import { Button, Link, Row, Spacer } from "@nextui-org/react";
import { FaDotCircle, FaWallet } from 'react-icons/fa';

export default function TopBar() {

  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

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
        setSigner(signer);
        setProvider(provider);
        setAccount(address);
        setConnected(true);

        ethereum.on('accountsChanged', async () => {
          checkIfWalletIsConnected();
        });
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
      setAccount(address);
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
        message= "Can't connect to Metamask. Please try again or contact our support."
      }
      alert(message);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []); 

  return (

      <Row 
        css={{
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
        }}>
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
          { isConnected ? 
            <Button 
              bordered 
              color="primary" 
              size="md" 
            >
              <FaWallet /> 
              <Spacer w={1} />
              {account.substring(0,15)}...
            </Button>
          : 
            <Button 
              bordered 
              color="primary" 
              size="md" 
              onClick={connectWallet}
            >
              <FaWallet /> 
              <Spacer w={1} />
              Connect your wallet
            </Button>
          }
      </Row>
  )
}
