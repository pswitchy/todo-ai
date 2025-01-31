// blockchain/hardhat.config.js
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY] // Use your private key from .env
    },
    // goerli: { // Example for Goerli testnet
    //   url: process.env.GOERLI_RPC_URL,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  },
};