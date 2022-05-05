import {ethers, Provider} from "ethers";

export async function getWallet (ethereum) {

  try {
    if (!ethereum) { // Make sure you have Metamask
      return {};
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
};