
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from 'ethers';
import { State } from './types';
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TransactionResponse } from '@ethersproject/abstract-provider';

/**
 * NOTE: run these tests on Rinkeby testnet directly
 * > npx hardhat test ./test/InhetheritWillTest.ts --network rinkeby 
 * Add PRIVATE_KEY and PRIVATE_KEY_2 in .env before. PRIVATE_KEY should have some ETH and at least 0.05 LINK tokens. PRIVATE_KEY_2 should just have some ETH
 * To get ETH and LINK faucets on Rinkeby: https://faucets.chain.link/rinkeby
 * 
 */

describe("InhetheritWill", function () {

  let willContractABI: string[];
  let InhetheritFacadeFactory: ContractFactory;
  let inhetheritFacade: Contract;

  beforeEach( async () => {
    
    willContractABI = [
      "function getGiver() public view returns(address)",
      "function getFirstName() public view returns(string memory)",
      "function getLastName() public view returns(string memory)",
      "function getBirthdayDate() public view returns(string memory)",
      "function getBirthPlace() public view returns(string memory)",
      "function getEth() public view returns(address)",
      "function getErc20Tokens() public view returns(address[] memory)",
      "function getClaims() public view returns(tuple(address heir, address erc20Token)[] memory)",
      "function getClaimsForHeir() public view returns(address[] memory)",
      "function getState() public view returns(uint)",
      "function reportDeath(string memory _deathDate) public isOpen hasClaim returns(bytes32 requestId)",
      "function claimFunds() public isClosed fundsWaitingForTransfer",
      "event FundsTransfered(address to)"
    ];    
    
    InhetheritFacadeFactory = await ethers.getContractFactory("InhetheritFacade");
    inhetheritFacade = await InhetheritFacadeFactory.deploy();
    await inhetheritFacade.deployed();
    await hre.run("fund-link", {
      contract: inhetheritFacade.address,
      linkaddress: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709', // RINKEBY TESTNET
      fundamount: '50000000000000000' // 0.05 LINK
    });
  })

  it("Updates state to CLOSED when reports death successfully", async function () {
    
    // Arrange 
    this.timeout(200000); // wait 200 seconds max

    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string = await heir.getAddress();

    // Act
    let tx: TransactionResponse = await inhetheritFacade.createWillWithEth(encodeURI("François"), encodeURI("Mitterrand"), encodeURI("26/10/1916"), encodeURI("16200"), heirAddress, {value: ethers.utils.parseEther("0.0001")});
    tx.wait(1);

    const willContractAddress: string = await inhetheritFacade.getWill();
    const heirConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);

    tx = await heirConnectedToWillContract.reportDeath(encodeURI('08/01/1996'));
    tx.wait(1);
  
    await new Promise(resolve => setTimeout(resolve, 30000)); // waiting for oracle response

    // Assert
    expect(await heirConnectedToWillContract.getState()).to.be.equal(State.CLOSED);
  });

  it("Does not update state to CLOSED when reports death not found", async function () {
    
    // Arrange 
    this.timeout(200000); // wait 200 seconds max

    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string = await heir.getAddress();

    // Act
    let tx: TransactionResponse = await inhetheritFacade.createWillWithEth(encodeURI("François"), encodeURI("Mitterrand"), encodeURI("26/10/1916"), encodeURI("16200"), heirAddress, {value: ethers.utils.parseEther("0.0001")});
    tx.wait(1);

    const willContractAddress: string = await inhetheritFacade.getWill();
    const heirConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);

    tx = await heirConnectedToWillContract.reportDeath(encodeURI('08/01/3000'));
    tx.wait(1);
  
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Assert
    expect(await heirConnectedToWillContract.getState()).to.be.equal(State.OPEN);
  });

  it("Claims funds", async function () {
    
    // Arrange 
    this.timeout(200000); // wait 200 seconds max

    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string = await heir.getAddress();

    // Act
    let tx: TransactionResponse = await inhetheritFacade.createWillWithEth(encodeURI("François"), encodeURI("Mitterrand"), encodeURI("26/10/1916"), encodeURI("16200"), heirAddress, {value: ethers.utils.parseEther("0.0001")});
    tx.wait(1);

    const willContractAddress: string = await inhetheritFacade.getWill();
    const heirConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);

    tx = await heirConnectedToWillContract.reportDeath(encodeURI('08/01/1996'));
    tx.wait(1);
  
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Assert
    await expect(heirConnectedToWillContract.claimFunds()).to.emit(heirConnectedToWillContract, "FundsTransfered").withArgs(heirAddress);
  });

  it("Reverts on claims funds if will state is OPEN", async function () {
    
    // Arrange 
    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string = await heir.getAddress();

    // Act
    let tx: TransactionResponse = await inhetheritFacade.createWillWithEth(encodeURI("François"), encodeURI("Mitterrand"), encodeURI("26/10/1916"), encodeURI("16200"), heirAddress, {value: ethers.utils.parseEther("0.0001")});
    tx.wait(1);

    const willContractAddress: string = await inhetheritFacade.getWill();
    const heirConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);

    // Assert
    await expect(heirConnectedToWillContract.claimFunds()).to.be.revertedWith("WILL_STILL_OPEN");
  });
});
