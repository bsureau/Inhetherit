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

export const erc20Names = {
  'ETH': 'Ethereum',
  'LINK': 'LinkChain',
  'WBTC': 'Wrapped BitCoin',
  'WETH': 'Wrapped Ethereum',
}