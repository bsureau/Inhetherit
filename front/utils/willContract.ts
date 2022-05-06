import { Contract, ethers } from "ethers";
import { getAllowance, getBalanceOf, maxUINT256 } from "./erc20Contract";

export const EMPTY_ADDRESS = 0x0000000000000000000000000000000000000000;

export const inhetheritFactoryAddress: string = "0x9A3aB3b41747e62e597Ca6Ed0052Ee22D052882B";

export const inhetheritFactoryABI: string[] = [
  "function createWill(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _erc20Token, address _heir) public returns(address)",
  "function getWill() public view returns(address)",
  "function addErc20Token(address _heir, address _erc20Token) public",
  "function removeErc20Token(address _heir, address _erc20Token) public",
];

export const willABI: string[] = [
  "function getLastName() public view returns(string memory)",
  "function getFirstName() public view returns(string memory)",
  "function getBirthdayDate() public view returns(string memory)",
  "function getBirthPlace() public view returns(string memory)",
  "function getClaims() public view returns(tuple(address heir, address erc20Token)[] memory)",
  "function getEth() public view returns(address)",
];

export async function getWill(user) {
  const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);

  try {
    const willAddress = await contract.getWill();
    const willContract: Contract = new ethers.Contract(willAddress, willABI, user.signer);

    const lastName = await willContract.getLastName();
    const firstName = await willContract.getFirstName();
    const postCode = await willContract.getBirthPlace();
    const birthdate = await willContract.getBirthdayDate();
    const ethHeirAddress = await willContract.getEth();
    let claims = await willContract.getClaims();

    // fetch balance for each token for which their is a will
    claims = await Promise.all(claims.map(async (claim) => {
      return {
        ...claim,
        allowance: await getAllowance(user, claim.erc20Token, willAddress),
        balance: await getBalanceOf(user, claim.erc20Token)
      };
    }));

    if (ethHeirAddress != EMPTY_ADDRESS) {
      claims.push({
        heir: ethHeirAddress,
        erc20Token: 'ETH',
        allowance: maxUINT256,
        balance: await willAddress.getBalance(),
      });
    }

    return {
      address: willAddress,
      lastName,
      firstName,
      postCode,
      birthdate,
      claims,
    };
  } catch (error) {
    /*if (error.reason = "WILL_NOT_FOUND") {
      return {};
    }*/
    return undefined;
  }
}

export async function removeErc20Token(user, heirAddress, erc20Address) {
  const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);
  return await contract.removeErc20Token(heirAddress, erc20Address);
}