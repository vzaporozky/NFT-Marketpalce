const { ethers } = require('ethers');

// const provider = new ethers.JsonRpcProvider('URL');
// const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const provider = new ethers.JsonRpcProvider('http://host.docker.internal:8545');

const contractAddress = '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae';

const contractABI = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'OwnableInvalidOwner',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'OwnableUnauthorizedAccount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ReentrancyGuardReentrantCall',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'BalanceDecreased',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Deposit',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'decreaseBalance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'deposit',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'emergencyWithdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'getBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

// Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
// Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

// Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
// Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

const contract = new ethers.Contract(contractAddress, contractABI, provider);

const privateKey =
	'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);
const contractWithSigner = contract.connect(wallet);

async function balanceManagerEther() {
	try {
		const balance = await contract.getBalance(
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		);
		console.log('Проверка:', balance.toString());

		let nonce = await provider.getTransactionCount(wallet.address, 'latest');

		const depositAmount = ethers.parseEther('3.0');
		const tx = await contractWithSigner.deposit({
			value: depositAmount,
			nonce: nonce++,
		});
		console.log('Транзакция депозита отправлена:', tx.hash);

		await tx.wait();
		console.log('Транзакция депозита подтверждена');

		const balance2 = await contract.getBalance(
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		);
		console.log('Проверка:', balance2.toString());

		// const depositAmount2 = ethers.parseEther('17.0');
		// const tx2 = await contractWithSigner.deposit({
		// 	value: depositAmount2,
		// 	nonce: nonce++,
		// });
		// console.log('Транзакция депозита отправлена:', tx2.hash);

		// await tx2.wait();
		// console.log('Транзакция депозита подтверждена');

		// const balance3 = await contract.getBalance(
		// 	'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		// );
		// console.log('Проверка:', balance3.toString());

		// const tx3 = await contractWithSigner.emergencyWithdraw();
		// console.log('Транзакция emergencyWithdraw отправлена:', tx3.hash);

		// await tx3.wait();
		// console.log('Транзакция emergencyWithdraw подтверждена');

		const tx4 = await contractWithSigner.decreaseBalance(
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		);
		console.log('Транзакция decreaseBalance отправлена:', tx4.hash);

		await tx4.wait();
		console.log('Транзакция decreaseBalance подтверждена');

		const balance4 = await contract.getBalance(
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		);
		console.log('Проверка:', balance4.toString());
	} catch (error) {
		console.error('Ошибка:', error);
	}
}

export { balanceManagerEther };
