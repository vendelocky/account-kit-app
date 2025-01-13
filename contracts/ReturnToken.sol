// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReturnToken is ERC20, Ownable {
    uint256 constant _one_token = 1e18;
    mapping(address => uint256) private tokenCount;

    event TokenMinted(address indexed to, uint256 amount);

    constructor() ERC20("Return", "RTN") Ownable(msg.sender){}

    function mintToken(address to) public onlyOwner {
        _mint(to, _one_token);
        tokenCount[to]++;
        emit TokenMinted(to, _one_token);
    }

    function getTokenCount(address to) public view returns (uint256) {
        return tokenCount[to];
    }
}
