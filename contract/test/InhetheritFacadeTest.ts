import { expect } from "chai";
import { ethers } from "hardhat";
import { MockContract, MockContractFactory, ProgrammableContractFunction, ProgrammedReturnValue, smock } from "@defi-wonderland/smock";
import { Contract, ContractFactory } from 'ethers';
import { State } from './types';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

describe("InhetheritFacade", function () {

  let willContractABI: string[];
  let InhetheritFacadeFactory: MockContractFactory<ContractFactory>;
  let inhetheritFacade: MockContract;
  let linkTokenFactory: MockContractFactory<ContractFactory>;
  let linkToken: MockContract;

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
      "function reportDeath(string memory _deathDate) public isOpen hasClaim returns(bytes32 requestId)"
    ];

    InhetheritFacadeFactory = await smock.mock("InhetheritFacade");
    inhetheritFacade = await InhetheritFacadeFactory.deploy();
    await inhetheritFacade.deployed();

    linkTokenFactory = await smock.mock("LinkTokenMock");
    linkToken = await linkTokenFactory.deploy();
    await linkToken.deployed();
    await inhetheritFacade.setVariable('linkToken', linkToken.address)
    linkToken.transfer.returns(true);
    linkToken.balanceOf.returns(ethers.utils.parseEther("0.05"));
  })

  it("Creates will contract with erc20 token", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token, hacker]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string = await heir.getAddress();
    const fakeErc20TokenAddress: string = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress);
    tx.wait(1);
    const willContractAddress: string = await inhetheritFacade.getWill();
    
    const heirConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const hackerConnectedToWillContract: Contract = new ethers.Contract(willContractAddress, willContractABI, hacker);

    // Assert
    expect(await heirConnectedToWillContract.getFirstName()).to.be.equal("Jean");
    expect(await heirConnectedToWillContract.getLastName()).to.be.equal("Bono");
    expect(await heirConnectedToWillContract.getBirthdayDate()).to.be.equal("07/12/1990");
    expect(await heirConnectedToWillContract.getBirthPlace()).to.be.equal("75012");
    expect((await heirConnectedToWillContract.getClaims()).length).to.be.equal(1);
    expect((await heirConnectedToWillContract.getClaimsForHeir()).length).to.be.equal(1);
    expect((await hackerConnectedToWillContract.getClaimsForHeir()).length).to.be.equal(0);
    expect(await hackerConnectedToWillContract.getState()).to.be.equal(State.OPEN);
  });

  it("Reverts on create will erc20 token if link missing ", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();
    linkToken.balanceOf.returns(ethers.utils.parseEther("0"));
    
    // Assert
    await expect(inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress)).to.be.revertedWith("LINK_MISSING");
  });
  
  it("Creates will contract with eth", async function () {

    // Arrange 
    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);

    // Assert
    const willContractAddress: string  = await inhetheritFacade.getWill();
    const balance: BigNumber = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("3.0");
  });

  it("Reverts on create will ethif link missing ", async function () {

    // Arrange 
    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    linkToken.balanceOf.returns(ethers.utils.parseEther("0"));
    
    // Assert
    await expect(inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")})).to.be.revertedWith("LINK_MISSING");
  });
  
  it("Reverts if will already exist on create will", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress);
    tx.wait(1);

    // Assert
    await expect(
      inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress)
    ).to.be.revertedWith("WILL_ALREADY_EXIST");
  });
  
  it("Reverts if will already exist on create will with Eth", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token, hacker]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);

    // Assert
    await expect(
      inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress)
    ).to.be.revertedWith("WILL_ALREADY_EXIST");
  });

  it("Reverts on getWill if giver does not have will", async function () {
     
    // Assert
    await expect(
      inhetheritFacade.getWill()
    ).to.be.revertedWith("WILL_NOT_FOUND");
  });

  it("Returns heir's wills", async function () {

    // Arrange 
    const [giver, giver2, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();

    // Act
    let tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    const willContract1Address: string  = await inhetheritFacade.getWill();

    const giver2ConnectedToInhetheritFacade: MockContract = inhetheritFacade.connect(giver2);
    tx = await giver2ConnectedToInhetheritFacade.createWillWithEth("Jean", "Némard", "10/11/1986", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    const willContract2Address: string  = await giver2ConnectedToInhetheritFacade.getWill();

    const heirConnectedToInhetheritFacade: MockContract = inhetheritFacade.connect(heir);
    const wills: [0, 1] = await heirConnectedToInhetheritFacade.getWills();

    // Assert
    expect(wills.length).to.be.equal(2);
    expect(wills[0]).to.be.equal(willContract1Address);
    expect(wills[1]).to.be.equal(willContract2Address);
  });

  it("Reverts on getWills if heir does not have will", async function () {

    // Assert
    await expect(
      inhetheritFacade.getWills()
     ).to.be.revertedWith("CLAIM_NOT_FOUND");
  });

  it("Adds erc20 token", async function () {

    // Arrange 
    const [giver, fakeErc20Token, fakeErc20Token2, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();
    const fakeErc20TokenAddress2: string  = await fakeErc20Token2.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress2);

    const willContractAddress: string  = await inhetheritFacade.getWill();
    const willContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const heirClaims: [0, 1] = await willContract.getClaimsForHeir();
    
    // Assert
    expect(await willContract.getEth()).to.be.equal(heirAddress);
    expect((await willContract.getClaims()).length).to.be.equal(2);
    expect(heirClaims.length).to.be.equal(2);
    expect((await willContract.getErc20Tokens()).length).to.be.equal(2);
    expect(heirClaims[0]).to.be.equal(fakeErc20TokenAddress);
    expect(heirClaims[1]).to.be.equal(fakeErc20TokenAddress2);
  });

  it("Reverts on addErc20Token if token is already given", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);

    // Assert
    await expect(inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("TOKEN_ALREADY_GIVEN");
  });

  it("Reverts on addErc20Token if will does not exist", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Assert
    await expect(inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("WILL_NOT_FOUND");
  });

  it("Removes erc20Token", async function () {

    // Arrange 
    const [giver, fakeErc20Token, fakeErc20Token2, fakeErc20Token3, heir, heir2]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const heirAddress2: string  = await heir2.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();
    const fakeErc20TokenAddress2: string  = await fakeErc20Token2.getAddress();
    const fakeErc20TokenAddress3: string  = await fakeErc20Token3.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.removeErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress2);
    await inhetheritFacade.addErc20Token(heirAddress2, fakeErc20TokenAddress3);
    await inhetheritFacade.removeErc20Token(heirAddress2, fakeErc20TokenAddress3);

    const willContractAddress: string  = await inhetheritFacade.getWill();
    const willContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const heirClaims: [0] = await willContract.getClaimsForHeir();

    // Assert
    expect(await willContract.getEth()).to.be.equal(heirAddress);
    expect((await willContract.getClaims()).length).to.be.equal(1);
    expect((await willContract.getClaimsForHeir()).length).to.be.equal(1);
    expect((await willContract.getErc20Tokens()).length).to.be.equal(1);
    expect(heirClaims[0]).to.be.equal(fakeErc20TokenAddress2);
    const heir2ConnectedToInhetheritFacade: MockContract = inhetheritFacade.connect(heir2);
    await expect(heir2ConnectedToInhetheritFacade.getWills()).to.be.revertedWith("CLAIM_NOT_FOUND");
  });

  it("Reverts on removeErc20Token if token is not found", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);

    // Assert
    await expect(inhetheritFacade.removeErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("TOKEN_NOT_FOUND")
  });

  it("Reverts on removeErc20Token if token does not belong to heir", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir, heir2]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const heirAddress2: string  = await heir2.getAddress();
    const fakeErc20TokenAddress: string  = await fakeErc20Token.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);

    // Assert
    await expect(inhetheritFacade.removeErc20Token(heirAddress2, fakeErc20TokenAddress)).to.be.revertedWith("TOKEN_DOES_NOT_MATCH_ADDRESS");
  });

  it("Adds ETH", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir, heir2]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();
    const heir2Address: string  = await heir2.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);

    inhetheritFacade.addEth(heir2Address, {value: ethers.utils.parseEther("3")})

    // Assert
    const willContractAddress: string  = await inhetheritFacade.getWill();
    const balance: BigNumber = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("6.0");
    const willContract: Contract = new ethers.Contract(willContractAddress, willContractABI, heir);
    expect(await willContract.getEth()).to.be.equal(heir2Address);
  });

  it("Reverts on addEth with no Eth sent", async function () {

    // Arrange 
    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress: string  = await heir.getAddress();

    // Act
    await expect(inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress)).to.be.revertedWith("ETH_MISSING");
  });

  it("Removes Eth", async function () {

    // Arrange 
    const [giver, heir]: SignerWithAddress[] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();

    // Act
    const tx: TransactionResponse = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3")});
    tx.wait(1);

    inhetheritFacade.removeEth(heirAddress);
    const heirConnectedToInhetheritFacade: MockContract = inhetheritFacade.connect(heir);

    // Assert
    const willContractAddress: string  = await inhetheritFacade.getWill();
    const balance: BigNumber = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("0.0");
    await expect(heirConnectedToInhetheritFacade.getWills()).to.be.revertedWith("CLAIM_NOT_FOUND");
  });
});
