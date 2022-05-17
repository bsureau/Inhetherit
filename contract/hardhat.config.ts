require("dotenv").config();
require('hardhat-contract-sizer');
require("@appliedblockchain/chainlink-plugins-fund-link");
import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      }
    },
  },
  networks : {
    hardhat: {
      forking: {
        url: process.env.STAGING_ALCHEMY_KEY,
        accounts: [process.env.PRIVATE_KEY],
      }
    },
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};
