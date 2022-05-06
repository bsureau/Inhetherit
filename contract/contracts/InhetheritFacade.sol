//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InhetheritWill.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InhetheritFacade {

    mapping(address => address) private giverToWill;
    mapping(address => address[]) private heirToWills;
    address private linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709; // TODO: change this on mainnet

    modifier isOpen {
         require(
             InhetheritWill(giverToWill[msg.sender]).getState() == InhetheritWill.State.OPEN,
            "NO_OPEN_WILL"
        );
        _;
    }

    modifier hasEnoughLink {
        require(
            IERC20(linkToken).balanceOf(address(this)) >= 0.05 * 10 ** 18,
            'LINK_MISSING'
        );
        _;
    }

    modifier hasNotWill {
        require(
            giverToWill[msg.sender] == address(0),
            "WILL_ALREADY_EXIST"
        );
        _;
    }

    modifier hasWill {
        require(
            giverToWill[msg.sender] != address(0),
            "WILL_NOT_FOUND"
        );
        _;
    }

    modifier hasClaim {
        require(
            heirToWills[msg.sender].length > 0,
            "CLAIM_NOT_FOUND"
        );
        _;
    }

    function createWill(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _erc20Token, address _heir) public hasEnoughLink hasNotWill returns(address) {    

        require( 
            giverToWill[msg.sender] == address(0) 
            , "WILL_ALREADY_EXIST"
        );

        InhetheritWill willContract = new InhetheritWill(msg.sender, _firstName, _lastName, _birthdayDate, _birthPlace);
        IERC20(linkToken).transfer(address(willContract), 0.05 * 10 ** 18);
        willContract.addErc20Token(_heir, _erc20Token);
        
        giverToWill[msg.sender] = address(willContract);
        heirToWills[_heir].push(address(willContract));

        return address(willContract);
    }

    function createWillWithEth(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) public hasEnoughLink hasNotWill payable returns(address) {    

        require(
            giverToWill[msg.sender] == address(0)
            , "WILL_ALREADY_EXIST"
        );

        require(msg.value > 0, "ETH_MISSING");

        InhetheritWill willContract = new InhetheritWill(msg.sender, _firstName, _lastName, _birthdayDate, _birthPlace);
        willContract.addEth{value:msg.value}(_heir);
        IERC20(linkToken).transfer(address(willContract), 0.05 * 10 ** 18);
        
         giverToWill[msg.sender] = address(willContract);
        heirToWills[_heir].push(address(willContract));
        
        return address(willContract);
    }

    function getWill() public hasWill view returns(address) {

        return giverToWill[msg.sender];
    } 

     function getWills() public hasClaim view returns(address[] memory) {

        return heirToWills[msg.sender];
    }

    function addErc20Token(address _heir, address _erc20Token) public hasWill isOpen {

        address willContractAddress = giverToWill[msg.sender];
        InhetheritWill(willContractAddress).addErc20Token(_heir, _erc20Token);
        addClaim(_heir, willContractAddress);
    }

    function removeErc20Token(address _heir, address _erc20Token) public hasWill isOpen {

        address willContractAddress = giverToWill[msg.sender];
        InhetheritWill(willContractAddress).removeErc20Token(_heir, _erc20Token);
        removeClaim(_heir, willContractAddress);
    }

    function addEth(address _heir) public hasWill isOpen payable {
        require(msg.value > 0, "ETH_MISSING");

        address willContractAddress = giverToWill[msg.sender];

        InhetheritWill(willContractAddress).addEth{value:msg.value}(_heir);
        addClaim(_heir, willContractAddress);
    }

    function removeEth(address _heir) public hasWill isOpen {

        address willContractAddress = giverToWill[msg.sender];
        InhetheritWill(willContractAddress).removeEth();
        removeClaim(_heir, willContractAddress);
    }
   
    function addClaim(address _heir, address _willContractAddress) private {

        for (uint i=0; i<heirToWills[_heir].length; i++) {
            if (heirToWills[_heir][uint(i)] == _willContractAddress) {
                return;
            }
        }
        heirToWills[_heir].push(_willContractAddress);
    }

    function removeClaim(address _heir, address _willContractAddress) private {

        address[] memory claims = InhetheritWill(_willContractAddress).getClaimsForHeir(_heir);
        if (claims.length == 0 && InhetheritWill(_willContractAddress).getEth() != _heir) {
             for (uint i=0; i<heirToWills[_heir].length; i++) {
                if (heirToWills[_heir][uint(i)] == _willContractAddress) {
                    heirToWills[_heir][uint(i)] = heirToWills[_heir][heirToWills[_heir].length - 1];
                    heirToWills[_heir].pop();
                    return;
                }
             }
        }
    }
}
