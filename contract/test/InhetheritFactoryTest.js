const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InhetheritFacade", function () {

  let willContractABI;
  let ContractFactory;
  let inhetheritFacade;

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
      "function getState() public view returns(uint)"
    ];
    ContractFactory = await ethers.getContractFacade("InhetheritFacade");
    inhetheritFacade = await ContractFactory.deploy();
    await inhetheritFacade.deployed();
  })

  it("Creates will contract with erc20 token", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token, hacker] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    const tx = await inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress);
    tx.wait(1);
    const willContractAddress = await inhetheritFacade.getWill();
    
    const heirConnectedToWillContract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const hackerConnectedToWillContract = new ethers.Contract(willContractAddress, willContractABI, hacker);

    // Assert
    expect(await heirConnectedToWillContract.getFirstName()).to.be.equal("Jean");
    expect(await heirConnectedToWillContract.getLastName()).to.be.equal("Bono");
    expect(await heirConnectedToWillContract.getBirthdayDate()).to.be.equal("07/12/1990");
    expect(await heirConnectedToWillContract.getBirthPlace()).to.be.equal("75012");
    expect((await heirConnectedToWillContract.getClaims()).length).to.be.equal(1);
    expect((await heirConnectedToWillContract.getClaimsForHeir()).length).to.be.equal(1);
    expect((await hackerConnectedToWillContract.getClaimsForHeir()).length).to.be.equal(0);
    expect(await hackerConnectedToWillContract.getState()).to.be.equal(0); // State.OPEN
  });
  
  it("Creates will contract with eth", async function () {

    // Arrange 
    const [giver, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);

    // Assert
    const willContractAddress = await inhetheritFacade.getWill();
    const balance = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("3.0");
  });

  
  it("Reverts if will already exist on create will", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token, hacker] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    const tx = await inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress);
    tx.wait(1);

    // Assert
    await expect(
      inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress)
    ).to.be.revertedWith("Will already created");
  });
  
  it("Reverts if will already exist on create will with Eth", async function () {

    // Arrange 
    const [giver, heir, fakeErc20Token, hacker] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);

    // Assert
    await expect(
      inhetheritFacade.createWill("Jean", "Bono", "07/12/1990", "75012", fakeErc20TokenAddress, heirAddress)
    ).to.be.revertedWith("Will already created");
  });

  it("Reverts on getWill if giver does not have will", async function () {
     
    // Assert
    await expect(
      inhetheritFacade.getWill()
    ).to.be.revertedWith("Will not found");
  });

  it("Returns heir's wills", async function () {

    // Arrange 
    const [giver, giver2, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();

    // Act
    let tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    const willContract1Address = await inhetheritFacade.getWill();

    const giver2ConnectedToInhetheritFacade = inhetheritFacade.connect(giver2);
    tx = await giver2ConnectedToInhetheritFacade.createWillWithEth("Jean", "Némard", "10/11/1986", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    const willContract2Address = await giver2ConnectedToInhetheritFacade.getWill();

    const heirConnectedToInhetheritFacade = inhetheritFacade.connect(heir);
    const wills = await heirConnectedToInhetheritFacade.getWills();

    // Assert
    expect(wills.length).to.be.equal(2);
    expect(wills[0]).to.be.equal(willContract1Address);
    expect(wills[1]).to.be.equal(willContract2Address);
  });

  it("Reverts on getWills if heir does not have will", async function () {

    // Assert
    await expect(
      inhetheritFacade.getWills()
     ).to.be.revertedWith("Claim not found");
  });

  it("Adds erc20 token", async function () {

    // Arrange 
    const [giver, fakeErc20Token, fakeErc20Token2, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();
    const fakeErc20TokenAddress2 = await fakeErc20Token2.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress2);

    const willContractAddress = await inhetheritFacade.getWill();
    const willContract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const heirClaims = await willContract.getClaimsForHeir();
    
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
    const [giver, fakeErc20Token, fakeErc20Token2, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);

    // Assert
    await expect(inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("Token already given");
  });

  it("Reverts on addErc20Token if will does not exist", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Assert
    await expect(inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("Will not found");
  });

  it("Removes erc20Token", async function () {

    // Arrange 
    const [giver, fakeErc20Token, fakeErc20Token2, fakeErc20Token3, heir, heir2] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const heirAddress2 = await heir2.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();
    const fakeErc20TokenAddress2 = await fakeErc20Token2.getAddress();
    const fakeErc20TokenAddress3 = await fakeErc20Token3.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.removeErc20Token(heirAddress, fakeErc20TokenAddress);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress2);
    await inhetheritFacade.addErc20Token(heirAddress2, fakeErc20TokenAddress3);
    await inhetheritFacade.removeErc20Token(heirAddress2, fakeErc20TokenAddress3);

    const willContractAddress = inhetheritFacade.getWill();
    const willContract = new ethers.Contract(willContractAddress, willContractABI, heir);
    const heirClaims = await willContract.getClaimsForHeir();

    // Assert
    expect(await willContract.getEth()).to.be.equal(heirAddress);
    expect((await willContract.getClaims()).length).to.be.equal(1);
    expect((await willContract.getClaimsForHeir()).length).to.be.equal(1);
    expect((await willContract.getErc20Tokens()).length).to.be.equal(1);
    expect(heirClaims[0]).to.be.equal(fakeErc20TokenAddress2);
    const heir2ConnectedToInhetheritFacade = inhetheritFacade.connect(heir2);
    await expect(heir2ConnectedToInhetheritFacade.getWills()).to.be.revertedWith("Claim not found");
  });

  it("Reverts on removeErc20Token if token is not found", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);

    // Assert
    await expect(inhetheritFacade.removeErc20Token(heirAddress, fakeErc20TokenAddress)).to.be.revertedWith("Token not found")
  });

  it("Reverts on removeErc20Token if token does not belong to heir", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir, heir2] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const heirAddress2 = await heir2.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    const tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);
    await inhetheritFacade.addErc20Token(heirAddress, fakeErc20TokenAddress);

    // Assert
    await expect(inhetheritFacade.removeErc20Token(heirAddress2, fakeErc20TokenAddress)).to.be.revertedWith("erc20Token does not belong to heir");
  });

  it("Adds ETH", async function () {

    // Arrange 
    const [giver, fakeErc20Token, heir, heir2] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const heir2Address = await heir2.getAddress();
    const fakeErc20TokenAddress = await fakeErc20Token.getAddress();

    // Act
    tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);

    inhetheritFacade.addEth(heir2Address, {value: ethers.utils.parseEther("3", 18)})

    // Assert
    const willContractAddress = await inhetheritFacade.getWill();
    const balance = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("6.0");
    const willContract = new ethers.Contract(willContractAddress, willContractABI, heir);
    expect(await willContract.getEth()).to.be.equal(heir2Address);
  });

  it("Reverts on addEth with no Eth sent", async function () {

    // Arrange 
    const [giver, heir, heir2] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();
    const heir2Address = await heir2.getAddress();

    // Act
    await expect(inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress)).to.be.revertedWith("No Eth sent");
  });

  it("Removes Eth", async function () {

    // Arrange 
    const [giver, heir] = await ethers.getSigners();
    const giverAddress = await giver.getAddress();
    const heirAddress = await heir.getAddress();

    // Act
    tx = await inhetheritFacade.createWillWithEth("Jean", "Bono", "07/12/1990", "75012", heirAddress, {value: ethers.utils.parseEther("3", 18)});
    tx.wait(1);

    inhetheritFacade.removeEth(heirAddress);
    heirConnectedToInhetheritFacade = inhetheritFacade.connect(heir);

    // Assert
    const willContractAddress = await inhetheritFacade.getWill();
    const balance = await ethers.provider.getBalance(willContractAddress);
    expect(ethers.utils.formatEther(balance)).to.be.equal("0.0");
    await expect(heirConnectedToInhetheritFacade.getWills()).to.be.revertedWith("Claim not found");
  });
});
