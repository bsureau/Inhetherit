//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract InhetheritWill {

    enum State { OPEN, CANCELED, CLOSED }

    address private giver;
    string private firstName;
    string private lastName;
    string private birthdayDate;
    string private birthPlace;
    address private heir;
    State private state;

    modifier onlyGiver {
        require(
            msg.sender == giver,
            "Only owner can call this function"
        );
        _;
    }

    constructor (address _giver, string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace, address _heir) {
        giver = _giver;
        firstName = _firstName;
        lastName = _lastName;
        birthdayDate = _birthdayDate;
        birthPlace = _birthPlace;
        heir = _heir;
        state = State.OPEN;
    }

    function getGiver() public view returns(address) {
        return giver;
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

    function getState() public view returns(State) {
        return state;
    }

    function cancel() public onlyGiver {
        state = State.CANCELED;
    }
}
