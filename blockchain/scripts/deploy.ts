import { ethers } from 'hardhat';

async function main() {
	// const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
	// console.log('Deploying NFTMarketplace...');
	// const NFTMarket = await NFTMarketplace.deploy('NFTMarketplace', 'NFTM', 100);
	// await NFTMarket.waitForDeployment();
	// console.log('NFTMarket deployed to:', await NFTMarket.getAddress());

	const Test = await ethers.getContractFactory('Test');
	console.log('Deploying Test...');
	const test = await Test.deploy('Hello world');
	await test.waitForDeployment();
	console.log('test deployed to:', await test.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
