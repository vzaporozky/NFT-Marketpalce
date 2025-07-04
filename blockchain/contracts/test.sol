// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test {
	string private _name;

	constructor(string memory name) {
		_name = name;
	}

	function getName() public view returns (string memory) {
		return _name;
	}
}
