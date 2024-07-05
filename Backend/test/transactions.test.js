// transactions.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions contract", () => {
  let transactionsContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Transactions = await ethers.getContractFactory("Transactions");
    transactionsContract = await Transactions.deploy();
  });

  describe("addToBlockchain", () => {
    it("should emit a Transfer event", async () => {
      const amount = 1;
      const message = "Hello, world!";
      const keyword = "test";

      await expect(
        transactionsContract.addToBlockchain(
          addr1.address,
          amount,
          message,
          keyword
        )
      )
        .to.emit(transactionsContract, "Transfer")
        .withArgs(
          owner.address,
          addr1.address,
          amount,
          message,
          expect.anything,
          keyword
        );
    });

    it("should increment transactionCount", async () => {
      await transactionsContract.addToBlockchain(
        addr1.address,
        1,
        "Hello, world!",
        "test"
      );
      expect(await transactionsContract.getTransactionCount()).to.equal(1);
    });

    it("should add transaction to transactions array", async () => {
      await transactionsContract.addToBlockchain(
        addr1.address,
        1,
        "Hello, world!",
        "test"
      );
      const transactions = await transactionsContract.getAllTransactions();
      expect(transactions.length).to.equal(1);
      expect(transactions[0].sender).to.equal(owner.address);
      expect(transactions[0].receiver).to.equal(addr1.address);
      expect(transactions[0].amount.toNumber()).to.equal(1);
      expect(transactions[0].message).to.equal("Hello, world!");
      expect(transactions[0].timestamp.toNumber()).to.be.a("number");
      expect(transactions[0].keyword).to.equal("test");
    });
  });

  describe("getAllTransactions", () => {
    it("should return an empty array if no transactions", async () => {
      const transactions = await transactionsContract.getAllTransactions();
      expect(transactions.length).to.equal(0);
    });

    it("should return an array of transactions", async () => {
      await transactionsContract.addToBlockchain(
        addr1.address,
        1,
        "Hello, world!",
        "test"
      );
      await transactionsContract.addToBlockchain(
        addr2.address,
        2,
        "Hello, again!",
        "test2"
      );
      const transactions = await transactionsContract.getAllTransactions();
      expect(transactions.length).to.equal(2);
    });
  });

  describe("getTransactionCount", () => {
    it("should return 0 if no transactions", async () => {
      expect(await transactionsContract.getTransactionCount()).to.equal(0);
    });

    it("should return the correct transaction count", async () => {
      await transactionsContract.addToBlockchain(
        addr1.address,
        1,
        "Hello, world!",
        "test"
      );
      await transactionsContract.addToBlockchain(
        addr2.address,
        2,
        "Hello, again!",
        "test2"
      );
      expect(await transactionsContract.getTransactionCount()).to.equal(2);
    });
  });
});
