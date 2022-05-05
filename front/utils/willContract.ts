import { Contract, ethers } from "ethers";

export async function getWill(user) {
  const inhetheritFactoryAddress: string = "0x9A3aB3b41747e62e597Ca6Ed0052Ee22D052882B";
  const inhetheritFactoryABI: string[] = [
    "function getWill() public view returns(address)",
  ];
  const willABI: string[] = [
    "function getLastName() public view returns(string memory)",
    "function getFirstName() public view returns(string memory)",
    "function getBirthdayDate() public view returns(string memory)",
    "function getBirthPlace() public view returns(string memory)",
    "function getClaims() public view returns(tuple(address heir, address erc20Token)[] memory)",
  ];
  const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);

  try {
    const willAddress = await contract.getWill();
    const willContract: Contract = new ethers.Contract(willAddress, willABI, user.signer);

    const lastName = await willContract.getLastName();
    const firstName = await willContract.getFirstName();
    const postCode = await willContract.getBirthPlace();
    const birthdate = await willContract.getBirthdayDate();
    const claims = await willContract.getClaims();

    return {
      will: {
        address: willAddress,
        lastName,
        firstName,
        postCode,
        birthdate,
        claims,
      }
    };
  } catch (error) {
    /*if (error.reason = "WILL_NOT_FOUND") {
      return {};
    }*/
    return undefined;
  }
}