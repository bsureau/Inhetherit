import Head from 'next/head'
import styles from '../styles/will.module.css'
import { ethers } from "ethers";
import Navbar from './components/nav';
import Sidebar from './components/sidebar';

async function approve() {

  const dercAddress = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
  const dercAbi = [
    "function approve(address _spender, uint256 _value) public returns (bool success)"
  ];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const dercContract = new ethers.Contract(dercAddress, dercAbi, signer);

  const tx = await dercContract.approve(dercAddress, ethers.utils.parseUnits("2", 18));

  await tx.wait(1);
  console.log(tx);
}

async function getAllowance() {

  const dercAddress = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
  const dercAbi = [
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
  ];

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const dercContract = new ethers.Contract(dercAddress, dercAbi, provider);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const allowance = await dercContract.allowance(address, dercAddress);
  console.log("allowance: ", allowance.toString());
}

async function transfer() {

  const dercAddress = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
  const dercAbi = [
    "function balanceOf(address account) public view returns (uint256 balance)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)"
  ];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const dercContract = new ethers.Contract(dercAddress, dercAbi, signer);
  const address = await signer.getAddress();
  console.log('address: ', address);
  const balance = await dercContract.balanceOf(address);
  console.log("balance: ", balance.toString());
  const tx = await dercContract.transferFrom(address, "0xbfDa4dC845e078f2C8239a2c1954cd5b49ddE378", balance.toString());
  tx.wait(1);
  console.log("tx: ", tx.hash);
}

export default function Will() {

  return (
      <div className="root">
        <Sidebar />
        <div className="container">
          <Head>
              <title>Inhetherit</title>
              <meta name="description" content="Find peace of mind. Bequeath your cryptos!" />
              <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <main className={styles.main}>
              <a className="primary-button">
                Bequeath your Ethers
              </a>
          </main>
        </div>
      </div>
  )
}
