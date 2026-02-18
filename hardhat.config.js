require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        celoSepolia: {
            url: process.env.CELO_SEPOLIA_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org",
            accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
            chainId: 11142220,
        },
        celo: {
            url: process.env.CELO_MAINNET_RPC_URL || "https://forno.celo.org",
            accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
            chainId: 42220,
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    etherscan: {
        apiKey: {
            celoSepolia: "any",
            celo: "any",
        },
        customChains: [
            {
                network: "celoSepolia",
                chainId: 11142220,
                urls: {
                    apiURL: "https://api-sepolia.celoscan.io/v2/api",
                    browserURL: "https://sepolia.celoscan.io",
                },
            },
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://explorer.celo.org/api",
                    browserURL: "https://explorer.celo.org",
                },
            },
        ],
    },
};
