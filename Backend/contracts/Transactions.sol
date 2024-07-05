// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {console} from "hardhat/console.sol";

/**
 * @title A web3.0 crypto transfer project
 * @author Kris
 * @notice The project uses hardhat
 */
contract Transactions {
    // state variables
    uint256 transactionCount;
    TransferStruct[] transactions;

    // events
    event Transfer(address from, address receiver, uint256 amount, string message, uint256 timestamp, string keyword);
    // structs

    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    function addToBlockchain(address payable receiver, uint256 amount, string memory message, string memory keyword)
        public
    {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    // getter functions

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
