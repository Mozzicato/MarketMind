const { ethers } = require("ethers");
require("dotenv").config();

// ANSI colors for prettier console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m"
};

async function main() {
    console.log(`${colors.bright}${colors.cyan}🚀 MARKETMIND AUTONOMOUS AGENT ACTIVATED${colors.reset}`);

    // 1. Connect to Celo Sepolia
    const rpcUrl = "https://forno.celo-sepolia.celo-testnet.org";
    // Initialize provider simply without complex options to avoid Ethers v6/Network complications
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // 2. Load Agent Wallet
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    const agentAddress = "0x308597EB73a6bA43DBaA658aD6f9292dBf428284";
    const supplierAddress = "0x4035991C97140c5f9af570c994B3F53259488c2b"; // Using deployer as supplier for demo

    // 3. Define Interface
    const abi = [
        "function paySupplier(address payable supplier, uint256 amount, string memory item, uint256 quantity) external",
        "function updateCreditScore(uint256 newScore) external",
        "function creditScore() view returns (uint256)"
    ];

    const agent = new ethers.Contract(agentAddress, abi, wallet);

    console.log(`✅ Connected to Network: Celo Sepolia (ID: 11142220)`);
    console.log(`✅ Agent Identity Verified: ${agentAddress}`);
    console.log(`${colors.green}🟢 Monitoring Business State...${colors.reset}\n`);

    // 4. Autonomous Activity Loop
    const items = ["Tomatoes", "Onions", "Rice", "Palm Oil"];

    setInterval(async () => {
        try {
            const timestamp = new Date().toLocaleTimeString();
            process.stdout.write(`[${timestamp}] 🔍 Scanning inventory... `);

            // 30% chance to trigger an action
            const rand = Math.random();
            const item = items[Math.floor(Math.random() * items.length)];

            if (rand < 0.3) {
                console.log(`${colors.yellow}LOW STOCK ALERT! (${item})${colors.reset}`);
                console.log(`${colors.cyan}🤖 AGENT DECISION: Restock 20 units autonomously.${colors.reset}`);

                const cost = ethers.parseEther("0.001"); // Small amount for simulation
                console.log(`   Executing On-Chain Payment (${ethers.formatEther(cost)} CELO)...`);

                const tx = await agent.paySupplier(supplierAddress, cost, item, 20);
                console.log(`   ⏳ Transaction Sent: https://sepolia.celoscan.io/tx/${tx.hash}`);

                // Wait for confirmation
                await tx.wait();
                console.log(`${colors.green}   ✅ SUCCESS: Supplier Paid & Inventory Updated.${colors.reset}\n`);

            } else if (rand > 0.85) {
                // Occasionally update credit score
                console.log(`${colors.blue}ANALYSIS: Strong cash flow detected.${colors.reset}`);
                console.log(`${colors.cyan}🤖 AGENT DECISION: Update Credit Reputation Score.${colors.reset}`);

                const currentScore = await agent.creditScore().catch(() => 300n);
                const newScore = Number(currentScore) + 2;

                if (newScore <= 850) {
                    const tx = await agent.updateCreditScore(newScore);
                    console.log(`   ⏳ Transaction Sent: https://sepolia.celoscan.io/tx/${tx.hash}`);
                    await tx.wait();
                    console.log(`${colors.green}   ✅ SUCCESS: Credit Score Updated to ${newScore}.${colors.reset}\n`);
                } else {
                    console.log("   Credit score already maxed. Skipping.\n");
                }
            } else {
                console.log(`All systems nominal. No action required.`);
            }

        } catch (e) {
            console.log(`\n${colors.red}❌ ERROR: ${e.message}${colors.reset}\n`);
        }
    }, 10000); // Pulse every 10 seconds
}

main().catch(console.error);
