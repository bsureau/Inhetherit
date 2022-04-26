import styles from "../../styles/components/nav.module.css"
import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import {WalletError} from '../../exceptions/walletError';

export default function Navbar() {

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
      <nav className={styles.main}>
          <a href="#" className="secondary-button">
              Ethereum Mainnet
          </a>
          { isConnected ? 
          <p>Connected with {account}</p>
          : 
          <a href="#" className="primary-button" onClick={connectWallet}>
              Connect your wallet
          </a>
          }
      </nav>
  )
}
