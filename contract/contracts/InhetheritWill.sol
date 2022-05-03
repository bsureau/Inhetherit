//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Claim.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract InhetheritWill is Ownable {

    enum State {OPEN, FILLED}

    address private giver;
    string private firstName;
    string private lastName;
    string private birthdayDate;
    string private birthPlace;
    address private eth;   
    address[] private erc20Tokens;
    Claim[] private claims;
    State private state;

    constructor (address _giver, string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace) {

        giver = _giver;
        firstName = _firstName;
        lastName = _lastName;
        birthdayDate = _birthdayDate;
        birthPlace = _birthPlace;
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

    function isErc20TokenRecorded(address _erc20Token) private view returns(bool) {

        for (uint i=0; i<erc20Tokens.length; i++) {
            if (erc20Tokens[uint(i)] == _erc20Token) {
                return true;
            }
        }
        return false;
    }
    
    function addErc20Token(address _heir, address _erc20Token) external onlyOwner {
        require(isErc20TokenRecorded(_erc20Token) == false, "Token already given");
        Claim memory claim = Claim(_heir, _erc20Token);
        claims.push(claim);
        erc20Tokens.push(_erc20Token);
    }

    function removeErc20Token(address _heir, address _erc20Token) external onlyOwner {

        require(isErc20TokenRecorded(_erc20Token) == true, "Token not found");

        for (uint i=0; i<claims.length; i++) {
            if (claims[uint(i)].erc20Token == _erc20Token) {
                if (claims[uint(i)].heir != _heir) {
                    revert('erc20Token does not belong to heir');
                }
                claims[uint(i)] = claims[claims.length - 1];
                claims.pop();
            }
        }

        for (uint i=0; i<erc20Tokens.length; i++) {
            if (erc20Tokens[uint(i)] == _erc20Token) {
                erc20Tokens[uint(i)] = erc20Tokens[erc20Tokens.length - 1];
                erc20Tokens.pop();
            }
        }
    }

    function getEth() public view returns(address) {

        return eth;
    }

    function addEth(address _heir) external payable onlyOwner {
        require(msg.value > 0, "No Eth sent");
        eth = _heir;
    }

    function removeEth() external onlyOwner {

       eth = address(0);
       payable (giver).transfer(address(this).balance);
    }

    function getErc20Tokens() public view returns(address[] memory) {
        return erc20Tokens;
    }

    function getClaims() public view returns(Claim[] memory) {

        return claims;
    }

    function getClaimsForHeir() public view returns(address[] memory) {

        uint claimsNb = 0;

        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == msg.sender) {
                claimsNb++;
            }
        }

        if (claimsNb == 0) {
            return new address[](0);
        }

        address[] memory heirErc20Tokens = new address[](claimsNb);
        heirErc20Tokens[0] = address(this);
        uint index;
   
        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == msg.sender) {
                heirErc20Tokens[index] =  address(claims[i].erc20Token);
                index++;
            }
        }

        return heirErc20Tokens;
    }

    function getClaimsForHeir(address _heir) external view onlyOwner returns(address[] memory) {

        uint claimsNb;

        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == _heir) {
                claimsNb++;
            }
        }

        if (claimsNb == 0) {
            return new address[](0);
        }

        address[] memory heirErc20Tokens = new address[](claimsNb);
        heirErc20Tokens[0] = address(this);
        uint index;
   
        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == _heir) {
                heirErc20Tokens[index] =  address(claims[i].erc20Token);
                index++;
            }
        }

        return heirErc20Tokens;
    }

    function getState() public view returns(State) {
        return state;
    }
}
