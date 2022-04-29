const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InhetheritWill", function () {
  
  it("Creates will contract", async function () {

    // Arrange 
    const [giver, heir] = await ethers.getSigners();
    const heirAddress = await heir.getAddress();

    const InhetheritWill = await ethers.getContractFactory("InhetheritWill");
    const willContract = await InhetheritWill.deploy("Jean", "Bono", "07/12/1990", "75012", heirAddress);
    await willContract.deployed();

    // Assert
    expect(await willContract.getFirstName()).to.be.equal("Jean");
    expect(await willContract.getLastName()).to.be.equal("Bono");
    expect(await willContract.getBirthdayDate()).to.be.equal("07/12/1990");
    expect(await willContract.getBirthPlace()).to.be.equal("75012");
    expect(await willContract.getHeir()).to.be.equal(await heirAddress);
  });
});
