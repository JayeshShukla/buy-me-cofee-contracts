import { expect } from "chai";
import hre from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
// 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// owner : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

describe("Lock", function () {
  async function deployOneYearLockFixture() {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    // deploy a lock contract where funds can be withdrawn
    // one year in the future
    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    return { lock, lockedAmount, unlockTime };
  }

  it("Should set the right unlockTime", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    // assert that the value is correct
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should revert with right error message when called too soon", async function () {
    const { lock } = await loadFixture(deployOneYearLockFixture);
    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });

  it("Should transfer the Funds to the Owner", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    await time.increaseTo(unlockTime);
    await lock.withdraw();
  });

  it("Should console return right message", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    await time.increaseTo(unlockTime);
    const [owner, otherAccount] = await hre.ethers.getSigners();
    await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
      "You aren't the owner"
    );
  });
});
