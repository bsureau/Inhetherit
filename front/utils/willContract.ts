import { Contract, ethers } from "ethers";
import { getAllowance, getBalanceOf } from "./erc20Contract";
import { maxUINT256ForToken } from "./erc20Contract";

export const EMPTY_ADDRESS = 0x0000000000000000000000000000000000000000;

export const inhetheritFactoryAddress: string = "0xe18d458de30171d95CA261ad0282613a5764BE0A";

export const inhetheritFactoryABI: string[] = [
  "function createWill(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _erc20Token, address _heir) public returns(address)",
  "function createWillWithEth(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) public payable returns(address)",
  "function getWill() public view returns(address)",
  "function getWills() public view returns(address[] memory)",
  "function addErc20Token(address _heir, address _erc20Token) public",
  "function addEth(address _heir) public payable",
  "function removeErc20Token(address _heir, address _erc20Token) public",
  "function removeEth(address _heir) public",
];

export const willABI: string[] = [
  "function getGiver() public view returns(address)",
  "function getLastName() public view returns(string memory)",
  "function getFirstName() public view returns(string memory)",
  "function getBirthdayDate() public view returns(string memory)",
  "function getBirthPlace() public view returns(string memory)",
  "function getClaims() public view returns(tuple(address heir, address erc20Token, bool filled)[] memory)",
  "function getClaimsForHeir(address _heir) external view returns(address[] memory)",
  "function getEth() public view returns(address)",
  "function getBalance() public view returns(uin256)",
  "function getErc20Tokens() public view returns(address[] memory)",
  "function getState() public view returns(uint8)",
  "function reportDeath(string memory _deathDate) public returns(bytes32 requestId)",
  "function claimFunds() public",
  "event DeathReport(bool isDead)",
  "event FundsTransfered(address to)"

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
        allowance: maxUINT256ForToken("ETH"),
        balance: await user.signer.provider.getBalance(willAddress),
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
    console.error(error);
    /*if (error.reason = "WILL_NOT_FOUND") {
      return {};
    }*/
    return undefined;
  }
}

export async function getHeirWills(user) {
  try {
    const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);
    let wills = await contract.getWills();

    wills = await Promise.all(wills.map(async (willAddress) => {
      const willContract: Contract = new ethers.Contract(willAddress, willABI, user.signer);

      const giverAddress = await willContract.getGiver();
      const ethHeirAddress = await willContract.getEth();
      let claims = await willContract.getClaimsForHeir(user.account);

      claims = await Promise.all(claims.map(async (claim) => {
        return {
          tokenAddress: claim,
          balance: await getBalanceOf(
            {
              account: giverAddress,
              signer: user.signer
            },
            claim
          )
        };
      }));

      if (ethHeirAddress == user.account) {
        claims.push({
          tokenAddress: 'eth',
          balance: await user.signer.provider.getBalance(willAddress),
        });
      }

      return claims.length > 0 ? {
        address: willAddress,
        state: await willContract.getState(),
        claims: claims,
        giverAddress: giverAddress,
        lastName: await willContract.getLastName(),
        firstName: await willContract.getFirstName(),
        postCode: await willContract.getBirthPlace(),
        birthdate: await willContract.getBirthdayDate(),
      } : {};
    }));

    return wills;
  } catch (error) {
    console.error(error);
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

export async function removeEth(user, heirAddress) {
  const contract: Contract = new ethers.Contract(inhetheritFactoryAddress, inhetheritFactoryABI, user.signer);
  return await contract.removeEth(heirAddress);
}
