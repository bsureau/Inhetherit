import { expect } from "chai";
import { ethers } from "hardhat";
import { MockContract, MockContractFactory, smock } from "@defi-wonderland/smock";
import { ContractFactory } from 'ethers';
import { Signer } from 'ethers';
import { Claim } from "./types";


describe("InhetheritWill", function () {

  let InhetheritWillFactory: MockContractFactory<ContractFactory>;
  let inhetheritWill: MockContract;
  let giver: Signer;
  let giverAddress: string;
  let heir: Signer;
  let heirAddress: string;
  let fakeErc20Token: Signer;
  let fakeErc20TokenAddress: string;
  let fakeErc20Token2: Signer;
  let fakeErc20TokenAddress2: string;

  beforeEach( async () => {

    [giver, heir, fakeErc20Token, fakeErc20Token2] = await ethers.getSigners();
    giverAddress = await giver.getAddress();
    heirAddress = await heir.getAddress();
    fakeErc20TokenAddress = await fakeErc20Token.getAddress();
    fakeErc20TokenAddress2 = await fakeErc20Token2.getAddress();
    
    InhetheritWillFactory = await smock.mock("InhetheritWill");
    inhetheritWill = await InhetheritWillFactory.deploy(giverAddress, "Jean", "Bono", "JJ/MM/AAAA", "75000");
    await inhetheritWill.deployed();
  });

  it("Reverts on report death if will is already closed", async function () {
    
    //Arrange
    inhetheritWill.setVariable('state', ethers.utils.formatBytes32String("1"));
    console.log('TEST: ', await inhetheritWill.getState());

    const claim: Claim = new Claim(heirAddress, fakeErc20TokenAddress, false);
    const claim2: Claim = new Claim(heirAddress, fakeErc20TokenAddress2, false);
    inhetheritWill.setVariable('claims', [
      {
          heir: claim.getHeir(),
          erc20Token: claim.getErc20Token(),
          filled: false
        }
      ]
    );


    const heirConnectedToInhetheritWill = inhetheritWill.connect(heir);

    // Assert
    expect(true).to.be.true;
    await expect(heirConnectedToInhetheritWill.reportDeath("JJ/MM/AAAA")).to.be.revertedWith("WILL_CLOSED");
  });
});
