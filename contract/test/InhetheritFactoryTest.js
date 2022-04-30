const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InhetheritFactory", function () {
  
  it("Creates will contract", async function () {

    // Arrange 
    const inhetheritWillContractABI = [
      "function getGiver() public view returns(address)",
      "function getFirstName() public view returns(string memory)",
      "function getLastName() public view returns(string memory)",
      "function getBirthdayDate() public view returns(string memory)",
      "function getBirthPlace() public view returns(string memory)",
      "function getHeir() public view returns(address)",
      "function getState() public view returns(uint8)"
    ];
    const [giver, heir] = await ethers.getSigners();
    const giverAddress = await giver.getAddress();
    const heirAddress = await heir.getAddress();

    const InhetheritFactory = await ethers.getContractFactory("InhetheritFactory");
    const inhetheritContract = await InhetheritFactory.deploy();
    await inhetheritContract.deployed();

    // Act
    tx = await inhetheritContract.createWill("Jean", "Bono", "07/12/1990", "75012", heirAddress);
    tx.wait(1);
  
    const willContractAddress = await inhetheritContract.getWill();
    const willContract = new ethers.Contract(willContractAddress, inhetheritWillContractABI, giver);

    // Assert
    expect(await inhetheritContract.getWill()).to.be.equal(willContractAddress);
    expect(await willContract.getGiver()).to.be.equal(giverAddress);
    expect(await willContract.getFirstName()).to.be.equal("Jean");
    expect(await willContract.getLastName()).to.be.equal("Bono");
    expect(await willContract.getBirthdayDate()).to.be.equal("07/12/1990");
    expect(await willContract.getBirthPlace()).to.be.equal("75012");
    expect(await willContract.getHeir()).to.be.equal(heirAddress);
    expect(await willContract.getState()).to.be.equal(0); // == "OPEN"
  });

  it("It reverts if will already exist", async function () {

    const [giver, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();

    const InhetheritFactory = await ethers.getContractFactory("InhetheritFactory");
    const inhetheritContract = await InhetheritFactory.deploy();
    await inhetheritContract.deployed();

    // Act
    tx = await inhetheritContract.createWill("Jean", "Bono", "07/12/1990", "75012", heirAddress);
    tx.wait(1);

    // Assert
    await expect(
      inhetheritContract.createWill("Jean", "Bono", "07/12/1990", "75012", heirAddress)
    ).to.be.revertedWith("Will already created");
  });
});
