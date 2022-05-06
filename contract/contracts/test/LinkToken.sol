// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";


contract LinkToken is LinkTokenInterface {

  function allowance(address owner, address spender) external view override returns (uint256 remaining){}

  function approve(address spender, uint256 value) external override returns (bool success){}

  function balanceOf(address owner) external view override returns (uint256 balance){}

  function decimals() external view override returns (uint8 decimalPlaces){}

  function decreaseApproval(address spender, uint256 addedValue) external override returns (bool success){}

  function increaseApproval(address spender, uint256 subtractedValue) external override{}

  function name() external view override returns (string memory tokenName){}

  function symbol() external view override returns (string memory tokenSymbol){}

  function totalSupply() external view override returns (uint256 totalTokensIssued){}

  function transfer(address to, uint256 value) external override returns (bool success){}

  function transferAndCall(
    address to,
    uint256 value,
    bytes calldata data
  ) external override returns (bool success){}

  function transferFrom(
    address from,
    address to,
    uint256 value
  ) external override returns (bool success){}

}
