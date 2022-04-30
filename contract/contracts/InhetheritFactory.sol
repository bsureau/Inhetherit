//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./InhetheritWill.sol";

contract InhetheritFactory {

    struct Will {
        address contractAddress;
        string firstName;
        string lastName;
        string birthdayDate;
        string birthPlace;
        address heir;
    }

    mapping(address => Will) private giverToWill;

    function createWill(string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) public returns(address) {    

        require( 
            giverToWill[msg.sender].contractAddress == address(0) ||
            InhetheritWill(giverToWill[msg.sender].contractAddress).getState() == InhetheritWill.State.CANCELED
            , "Will already created");

        InhetheritWill willContract = new InhetheritWill(msg.sender, _firstName, _lastName, _birthdayDate, _birthPlace, _heir);
        
        address willContractAddress = address(willContract);

        Will memory will = Will(willContractAddress, _firstName, _lastName, _birthdayDate, _birthPlace, _heir);

        giverToWill[msg.sender] = will;

        return willContractAddress;
    }

    function getWill() public view returns(address) {
        return giverToWill[msg.sender].contractAddress;
    }
}
