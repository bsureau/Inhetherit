import { Contract, ethers } from "ethers";
import { getAllowance, getBalanceOf } from "./erc20Contract";

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
    let claims = await willContract.getClaims();

    // fetch balance for each token for which their is a will
    claims = await Promise.all(claims.map(async (claim) => {
      return {
        ...claim,
        allowance: await getAllowance(user, claim.erc20Token, willAddress),
        balance: await getBalanceOf(user, claim.erc20Token)
      };
    }));

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