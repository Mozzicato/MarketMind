const { ChaosChainSDK, NetworkConfig, AgentRole } = require('@chaoschain/sdk');
require('dotenv').config();

async function main() {
    // Try both Celo networks supported by the SDK
    const networks = [NetworkConfig.CELO_TESTNET, NetworkConfig.CELO_MAINNET];

    for (const net of networks) {
        console.log(`\n🔍 Checking network: ${net}`);
        try {
            const sdk = new ChaosChainSDK({
                agentName: 'MarketMind',
                agentDomain: 'marketmind-agent.vercel.app',
                agentRole: AgentRole.WORKER,
                network: net,
                privateKey: process.env.DEPLOYER_PRIVATE_KEY,
                rpcUrl: net === NetworkConfig.CELO_TESTNET ? "https://alfajores-forno.celo-testnet.org" : "https://forno.celo.org"
            });

            const info = sdk.getNetworkInfo();
            console.log("   Identity Registry:", info.contracts.IdentityRegistry);
            console.log("   Reputation Registry:", info.contracts.ReputationRegistry);
        } catch (e) {
            console.log(`   Error on ${net}: ${e.message}`);
        }
    }
}

main().catch(console.error);
