// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract BalanceManager is Ownable, ReentrancyGuard {
	mapping(address => uint256) private balances;

	event Deposit(address indexed user, uint256 amount);
	event Withdrawal(address indexed user, uint256 amount);
	event Transfer(address indexed from, address indexed to, uint256 amount);

	constructor() Ownable(msg.sender) {}

	// Deposit ETH to the contract
	function deposit() external payable nonReentrant {
		require(msg.value > 0, 'Deposit amount must be greater than 0');
		balances[msg.sender] += msg.value;
		emit Deposit(msg.sender, msg.value);
	}

	// Withdraw ETH from the contract
	function withdraw(uint256 amount) external nonReentrant {
		require(amount > 0, 'Withdrawal amount must be greater than 0');
		require(balances[msg.sender] >= amount, 'Insufficient balance');

		balances[msg.sender] -= amount;
		(bool success, ) = msg.sender.call{ value: amount }('');
		require(success, 'Withdrawal failed');

		emit Withdrawal(msg.sender, amount);
	}

	// Transfer balance to another user
	function transfer(address to, uint256 amount) external nonReentrant {
		require(to != address(0), 'Invalid recipient');
		require(amount > 0, 'Transfer amount must be greater than 0');
		require(balances[msg.sender] >= amount, 'Insufficient balance');

		balances[msg.sender] -= amount;
		balances[to] += amount;

		emit Transfer(msg.sender, to, amount);
	}

	// Get balance of an address
	function getBalance(address user) external view returns (uint256) {
		return balances[user];
	}

	// Allow owner to withdraw contract balance (emergency use)
	function emergencyWithdraw() external onlyOwner nonReentrant {
		uint256 contractBalance = address(this).balance;
		require(contractBalance > 0, 'No funds to withdraw');

		(bool success, ) = owner().call{ value: contractBalance }('');
		require(success, 'Emergency withdrawal failed');
	}
}
