// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BalanceManager is Ownable, ReentrancyGuard {
    mapping(address => uint256) private balances;
    uint256 price = 0.0008 ether;

    event Deposit(address indexed user, uint256 amount);
    event BalanceDecreased(address indexed user, uint256 amount);
    event PriceUpdated(uint256 newPrice);
    event Withdrawal(address indexed user, uint256 amount);

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

    function setPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        price = newPrice;
        emit PriceUpdated(newPrice);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "Withdrawal failed");

        emit Withdrawal(msg.sender, amount);
    }

    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{ value: contractBalance }("");
        require(success, "Emergency withdrawal failed");
    }
}
