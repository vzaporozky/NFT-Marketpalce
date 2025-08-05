import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
// import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("NFTMarketplace", {
    from: deployer,
    // args: [deployer],
    log: true,
    autoMine: true,
  });

  // await deploy("BalanceManager", {
  //   from: deployer, 
  //   // args: [deployer],
  //   log: true,
  //   autoMine: true,
  // });

  const nftMarketplace = await hre.ethers.getContract<Contract>("NFTMarketplace", deployer);
  console.log("👋 Initial greeting:", await nftMarketplace.getAddress());

  // const balanceManager = await hre.ethers.getContract<Contract>("BalanceManager", deployer);
  // console.log("👋 Initial greeting:", await balanceManager.getAddress());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
