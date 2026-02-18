import { ChaosChainSDK, NetworkConfig, AgentRole } from '@chaoschain/sdk';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

async function main() {
    console.log("Networks:", Object.keys(NetworkConfig));

    const sdk = new ChaosChainSDK({
        agentName: 'MarketMind',
        agentDomain: 'marketmind-agent.vercel.app',
        agentRole: AgentRole.WORKER,
        network: NetworkConfig.CELO_TESTNET,
        privateKey: process.env.DEPLOYER_PRIVATE_KEY,
        rpcUrl: process.env.CELO_RPC_URL,
    });

    console.log("SDK initialized for address:", sdk.getAddress());

    // Check if identity registry is live
    try {
        const info = sdk.getNetworkInfo();
        console.log("Identity Registry:", info.contracts.IdentityRegistry);
    } catch (e) {
        console.error("Network info error:", e.message);
    }
}

main().catch(console.error);
