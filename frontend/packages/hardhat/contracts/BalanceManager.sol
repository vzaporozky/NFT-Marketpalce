// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract BalanceManager is Ownable, ReentrancyGuard {
	mapping(address => uint256) private balances;

	event Deposit(address indexed user, uint256 amount);
	event BalanceDecreased(address indexed user, uint256 amount);

	constructor() Ownable(msg.sender) {}

	function getBalance(address user) external view returns (uint256) {
		return balances[user];
	}

	function deposit() external payable nonReentrant {
		require(msg.value > 0, 'Deposit amount must be greater than 0');
		balances[msg.sender] += msg.value;
		emit Deposit(msg.sender, msg.value);
	}

	function decreaseBalance(address user) external onlyOwner nonReentrant {
		require(user != address(0), 'Invalid user address');

		uint256 decrease = 1 ether;
		require(decrease > 0, 'Amount must be greater than 0');
		require(balances[user] >= decrease, 'Insufficient balance');

		balances[user] -= decrease;

		emit BalanceDecreased(user, decrease);
	}

	function emergencyWithdraw() external onlyOwner nonReentrant {
		uint256 contractBalance = address(this).balance;
		require(contractBalance > 0, 'No funds to withdraw');

		(bool success, ) = owner().call{ value: contractBalance }('');
		require(success, 'Emergency withdrawal failed');
	}
}
