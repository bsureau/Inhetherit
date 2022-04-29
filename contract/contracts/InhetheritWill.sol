//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract InhetheritWill {

    string private firstName;
    string private lastName;
    string private birthdayDate;
    string private birthPlace;
    address private heir;

    constructor (string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) {
        firstName = _firstName;
        lastName = _lastName;
        birthdayDate = _birthdayDate;
        birthPlace = _birthPlace;
        heir = _heir;
    }

    function getFirstName() public view returns(string memory) {
        return firstName;
    }

    function getLastName() public view returns(string memory) {
        return lastName;
    }

    function getBirthdayDate() public view returns(string memory) {
        return birthdayDate;
    }

    function getBirthPlace() public view returns(string memory) {
        return birthPlace;
    }

    function getHeir() public view returns(address) {
        return heir;
    }
}
