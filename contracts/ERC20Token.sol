// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    address public minter;

    event MinterChanged(address indexed from, address to);

    constructor(string memory tokenName, string memory tokenSybmol) payable ERC20(tokenName, tokenSybmol) {
        minter = msg.sender;
    }

    function passMinterRole(address ticketEvent) public returns (bool) {
        require(msg.sender == minter, "You cannot change minter role");
        minter = ticketEvent;
        
        emit MinterChanged(msg.sender, ticketEvent);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "You cannot mint tokens");

        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        require(msg.sender == minter, "You cannot burn tokens");

        _burn(account, amount);
    }
}