const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const agentId = 31;
    const agentAddress = "0x308597EB73a6bA43DBaA658aD6f9292dBf428284";
    const registryAddress = "0x8004A818BFB912233c491871b3d84c89A494BD9e";

    console.log("\n✨ MARKETMIND AGENT DEMO LINKS ✨");
    console.log("=================================");
    console.log("\n1. 🛡️ Agent Identity (ERC-8004) - Celo Sepolia");
    console.log(`   Blockscout: https://celo-sepolia.blockscout.com/token/${registryAddress}/instance/${agentId}`);

    console.log("\n2. 💼 Agent Wallet & Contracts");
    console.log(`   Agent Contract: https://celo-sepolia.blockscout.com/address/${agentAddress}`);

    console.log("\n3. 📊 Frontend Dashboard");
    console.log(`   Local URL: http://localhost:3000`);

    console.log("\n=================================");
    console.log("Ready for demo! 🚀\n");
}

main().catch(console.error);
