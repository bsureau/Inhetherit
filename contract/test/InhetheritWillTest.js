const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InhetheritWill", function () {
  
  it("Creates will contract", async function () {

    // Arrange 
    const [giver, heir] = await ethers.getSigners();
    const giverAddress = await giver.getAddress();
    const heirAddress = await heir.getAddress();

    // Act
    const InhetheritWill = await ethers.getContractFactory("InhetheritWill");
    const willContract = await InhetheritWill.deploy(giverAddress, "Jean", "Bono", "07/12/1990", "75012", heirAddress);
    await willContract.deployed();

    // Assert
    expect(await willContract.getFirstName()).to.be.equal("Jean");
    expect(await willContract.getLastName()).to.be.equal("Bono");
    expect(await willContract.getBirthdayDate()).to.be.equal("07/12/1990");
    expect(await willContract.getBirthPlace()).to.be.equal("75012");
    expect(await willContract.getHeir()).to.be.equal(await heirAddress);
  });

  it("Cancels will contract", async function () {

    // Arrange 
    const [giver, heir] = await ethers.getSigners();
    const giverAddress = await giver.getAddress();
    const heirAddress = await heir.getAddress();

    // Act
    const InhetheritWill = await ethers.getContractFactory("InhetheritWill");
    const willContract = await InhetheritWill.deploy(giverAddress, "Jean", "Bono", "07/12/1990", "75012", heirAddress);
    await willContract.deployed();

    // Assert
    expect(await willContract.getState()).to.be.equal(0); // == "OPEN"
    await willContract.cancel();
    expect(await willContract.getState()).to.be.equal(1); // == "CANCELED"
  });

  it("Fails cancel contract if msg.sender is not the giver", async function () {

    // Arrange 
    const [giver, heir, hacker] = await ethers.getSigners();
    const giverAddress = await giver.getAddress();
    const heirAddress = await heir.getAddress();

    // Act
    const InhetheritWill = await ethers.getContractFactory("InhetheritWill");
    const willContract = await InhetheritWill.deploy(giverAddress, "Jean", "Bono", "07/12/1990", "75012", heirAddress);
    await willContract.deployed();

    const hackerConnectedToWillContract = willContract.connect(hacker);

     // Assert
    await expect(
      hackerConnectedToWillContract.cancel()
    ).to.be.revertedWith("Only owner can call this function");
  });
});
