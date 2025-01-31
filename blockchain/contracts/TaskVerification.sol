// blockchain/contracts/TaskVerification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskVerification {
    mapping(bytes32 => bool) public taskHashes;

    function verifyTaskCompletion(bytes32 taskHash) public {
        taskHashes[taskHash] = true;
    }

    function isTaskVerified(bytes32 taskHash) public view returns (bool) {
        return taskHashes[taskHash];
    }
}