import { Contract, ethers } from "ethers";

export const erc20Abi = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _tokenOwner, address _spender) public view returns(uint256)",
  "function balanceOf(address _owner) public view returns(uint256)",
];

export const erc20Addresses = {
  'ETH': 'ETH',
  'LINK': '0x01be23585060835e02b77ef475b0cc51aa1e0709',
  'WBTC': '',
  'WETH': '0xdf032bc4b9dc2782bb09352007d4c57b75160b15',
};

export const maxUINT256 = ethers.utils.parseUnits("2", 18);

export function getErc20Iso3FromAddress(address: string) {
  return Object.keys(erc20Addresses).find(key => erc20Addresses[key] == address.toLowerCase());
}

export async function getBalanceOf(user, erc20Address) {
  const contract: Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
  return await contract.balanceOf(user.account);
}

export async function getAllowance(user, erc20Address, willAddress) {
  const contract: Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
  return await contract.allowance(user.account, willAddress);
}