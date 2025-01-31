// blockchain/scripts/deploy.js
const hre = require("hardhat");
require('dotenv').config(); // Load environment variables if needed

async function main() {
  const TaskVerification = await hre.ethers.getContractFactory("TaskVerification");
  const taskVerification = await TaskVerification.deploy();

  await taskVerification.deployed();

  console.log("TaskVerification contract deployed to:", taskVerification.address);
  console.log("Contract ABI (save this to backend/artifacts/contracts/TaskVerification.sol/TaskVerification.json):", JSON.stringify(TaskVerification.interface.format('json'), null, 2)); // Output ABI to console
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });