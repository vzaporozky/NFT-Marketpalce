import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    autoMine: true,
  });

  // const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
  // console.log('Deploying NFTMarketplace...');
  // const NFTMarket = await NFTMarketplace.deploy('NFTMarketplace', 'NFTM', 100);
  // await NFTMarket.waitForDeployment();
  // console.log('NFTMarket deployed to:', await NFTMarket.getAddress());

  const BalanceManager = await hre.ethers.getContractFactory("BalanceManager");
  console.log("Deploying BalanceManager...");
  const bm = await BalanceManager.deploy();
  await bm.waitForDeployment();
  console.log("BalanceManager deployed to:", await bm.getAddress());

  // const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  // console.log("👋 Initial greeting:", await yourContract.greeting());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
