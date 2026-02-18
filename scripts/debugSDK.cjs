const { ChaosChainSDK, NetworkConfig, AgentRole } = require('@chaoschain/sdk');
require('dotenv').config();

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

    const info = sdk.getNetworkInfo();
    console.log("Identity Registry:", info.contracts.IdentityRegistry);
}

main().catch(console.error);
