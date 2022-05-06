//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Claim.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract InhetheritWill is Ownable, ChainlinkClient {

    enum State {OPEN, CLOSED}

    address private giver;
    string private firstName;
    string private lastName;
    string private birthdayDate;
    string private birthPlace;
    address private eth;   
    address[] private erc20Tokens;
    Claim[] private claims;
    State private state;

    using Chainlink for Chainlink.Request;
  
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    modifier isOpen {
        require(
            state == State.OPEN,
            "WILL_CLOSED"
        );
        _;
    }

    modifier isClosed {
        require(
            state == State.CLOSED,
            "WILL_STILL_OPEN"
        );
        _;
    }

    modifier hasClaim {
        bool result = false;

        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == msg.sender && claims[i].filled == false) {
                result = true;
            }
        }

        require(
            result == true,
            "NOTHING_TO_CLAIM"
        );
        _;
    }

    event DeathReport(bool isDead);

    constructor (address _giver, string memory _firstName, string memory _lastName, string memory _birthdayDate, string memory _birthPlace) {

        giver = _giver;
        firstName = _firstName;
        lastName = _lastName;
        birthdayDate = _birthdayDate;
        birthPlace = _birthPlace;
        state = State.OPEN;

        setPublicChainlinkToken();
        oracle = 0xD0691a51e3C6c562691D3C44C2944Bd9D368Ec1f; //TODO: change on mainnet
        jobId = "de58d01b258c492198602cdae0d47eb6"; //TODO: change on mainnet
        fee = 0.05 * 10 ** 18; // TODO: change on mainnet (varies by network and job) 
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

        require(isErc20TokenRecorded(_erc20Token) == false, "TOKEN_ALREADY_GIVEN");
        Claim memory claim = Claim(_heir, _erc20Token, false);
        claims.push(claim);
        erc20Tokens.push(_erc20Token);
    }

    function removeErc20Token(address _heir, address _erc20Token) external onlyOwner {

        require(isErc20TokenRecorded(_erc20Token) == true, "TOKEN_NOT_FOUND");

        for (uint i=0; i<claims.length; i++) {
            if (claims[uint(i)].erc20Token == _erc20Token) {
                if (claims[uint(i)].heir != _heir) {
                    revert('TOKEN_DOES_NOT_MATCH_ADDRESS');
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

    function reportDeath(string memory _deathDate) public isOpen hasClaim returns(bytes32 requestId) {
        
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        string memory url = string(abi.encodePacked("https://deces.matchid.io/deces/api/v1/search?firstName=", firstName, "&lastName=", lastName, "&birthDate=", birthdayDate, "&birthPostalCode=", birthPlace, "&deathDate=", _deathDate, "&fuzzy=false"));
        request.add("get", url);
        request.add("path", "response,total"); 
        request.addInt("multiply", 1);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function fulfill(bytes32 _requestId, uint8 _total) public recordChainlinkFulfillment(_requestId)
    {
        if (_total > 0) {
            state = State.CLOSED;
            emit DeathReport(true);
        }

        emit DeathReport(false);
    }

    function claimFunds() public isClosed {

        for (uint i=0; i<claims.length; i++) {
            if (claims[i].heir == msg.sender && claims[i].filled == false) {
                uint256 amount = IERC20(claims[i].erc20Token).allowance(giver, address(this));
                IERC20(claims[i].erc20Token).transfer(msg.sender, amount);
                claims[i].filled = true;
            }
        }

        if (eth == msg.sender) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }
}
