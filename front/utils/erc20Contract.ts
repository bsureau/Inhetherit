import { Contract, ethers } from "ethers";
import tokens from '../config/tokens.json';

export const erc20Abi = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _tokenOwner, address _spender) public view returns(uint256)",
  "function balanceOf(address _owner) public view returns(uint256)",
];

export function getAddressFromToken (token: string) {
  return tokens[token].address;
}

export function getTokenInformation(token: string) {
  return tokens[token] ?? undefined;
}

export function maxUINT256ForToken(token: string) {
  const tokenInformation = getTokenInformation(token);
  return ethers.utils.parseUnits(`${tokenInformation.maxSupply}`, tokenInformation.decimals);
}

export function getErc20Iso3FromAddress(address: string) {
  return Object.keys(tokens).find(key => getAddressFromToken(key) == address.toLowerCase());
}

export function isERC20Token(token: string) {
  const tokenInformation = getTokenInformation(token);
  return tokenInformation ? tokenInformation.isERC20 : undefined;
}

export async function getBalanceOf(giver, erc20Address) {
  if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
    throw new Error('You cannot get balance of not ERC20 token');
  }
  const contract: Contract = new ethers.Contract(erc20Address, erc20Abi, giver.signer);
  return await contract.balanceOf(giver.account);
}

export async function getAllowance(giver, erc20Address, willAddress) {
  if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
    throw new Error('You cannot get allowance of not ERC20 token');
  }
  const contract: Contract = new ethers.Contract(erc20Address, erc20Abi, giver.signer);
  return await contract.allowance(giver.account, willAddress);
}
