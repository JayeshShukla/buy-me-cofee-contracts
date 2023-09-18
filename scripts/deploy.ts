import { ethers } from "hardhat";

async function main() {
  const buymeacoffee = await ethers.deployContract("BuyMeACoffee");
  const deployedContract = await buymeacoffee.waitForDeployment();
  console.log("BuyMeACoffee deployed to ", deployedContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
