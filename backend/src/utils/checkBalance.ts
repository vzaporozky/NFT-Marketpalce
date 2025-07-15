import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('YOUR_ETHEREUM_NODE_URL'); // Replace with your node URL (Alchemy)
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your smart contract address
const contractABI = [
	// Minimal ABI for balance check
	'function balanceOf(address) view returns (uint256)',
	'function deposit() payable',
];
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Minimum balance required to create a photo (in wei)
const MINIMUM_BALANCE = ethers.parseEther('0.01'); // Adjust as needed

async function checkUserBalance(fastify, userAddress) {
	try {
		const balance = await contract.balanceOf(userAddress);
		return balance >= MINIMUM_BALANCE;
	} catch (error) {
		fastify.log.error('Balance check error:', error);
		throw new Error('Failed to check user balance');
	}
}

export { checkUserBalance };
