import { AlchemyProvider } from "ethers/lib.commonjs/providers";
import abi from "../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json";
import { ethers } from "hardhat";
require("dotenv").config();

// const SEPOLIA_URL = process.env.SEPOLIA_URL;
const SEPOLIA_API = process.env.SEPOLIA_API;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const getBalance = async (provider: AlchemyProvider, address: string) => {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
};

async function main() {
  const contractAddress = "0x6bc0b90706dd4d0fc5e09fbd2d9ecc8b7b766323";
  const contractABI = abi.abi;
  try {
    if (SEPOLIA_API && PRIVATE_KEY) {
      const provider = new ethers.AlchemyProvider("sepolia", SEPOLIA_API);
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      const buymeacoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(
        "current balance of owner:",
        await getBalance(provider, signer.address),
        "ETH"
      );

      const contractBalance = await getBalance(
        provider,
        await buymeacoffee.getAddress()
      );

      console.log(
        "current balance of owner:",
        await getBalance(provider, signer.address),
        "ETH"
      );

      if (contractBalance !== "0.0") {
        console.log("Funds Withdrawing...");
        const withdrawTxn = await buymeacoffee.withdrawTips();
        await withdrawTxn.wait();
      } else {
        console.log("Insufficient funds to withdraw");
      }

      console.log(
        "current balance of owner:",
        await getBalance(provider, signer.address),
        "ETH"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
