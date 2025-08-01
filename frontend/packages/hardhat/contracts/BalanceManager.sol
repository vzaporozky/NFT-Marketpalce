// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BalanceManager is Ownable, ReentrancyGuard {
    mapping(address => uint256) private balances;
    uint256 price = 0.0008 ether;

    event Deposit(address indexed user, uint256 amount);
    event BalanceDecreased(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function createPhoto() external nonReentrant {
        require(balances[msg.sender] >= price, "Insufficient balance");
        balances[msg.sender] -= price;
        emit BalanceDecreased(msg.sender, price);
    }

    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{ value: contractBalance }("");
        require(success, "Emergency withdrawal failed");
    }
}
