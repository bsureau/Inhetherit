import {ethers, Provider} from "ethers";
import {WalletError} from "../exceptions/walletError";

export async function getWallet (ethereum) {

  try {
    if (!ethereum) { // Make sure you have Metamask
      throw new WalletError("Please install Metamask first: https://metamask.io");
    }

    const provider: Provider = new ethers.providers.Web3Provider(ethereum); // Connect to Ethereum using MetaMask
    const accounts: any[] = await provider.send("eth_accounts", []); // Retrieve authorized accounts

    if (accounts.length > 0) {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await signer.getBalance();

      return {
        account: address,
        balance: balance,
        signer: signer
      };

    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function connectWallet (ethereum) {
  try {
    if (!ethereum) { // Make sure you have Metamask
      throw new WalletError("Please install Metamask first: https://metamask.io");
    }

    const provider: Provider = new ethers.providers.Web3Provider(ethereum); // Connect to Ethereum using MetaMask
    await provider.send("eth_requestAccounts", []); // Requesting permission to connect users accounts

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();

    return {
      account: address,
      balance: balance,
      signer: signer
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}