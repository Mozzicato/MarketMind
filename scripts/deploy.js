const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting MarketMind deployment to Celo...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CELO\n");

    // Deploy CreditScoring contract
    console.log("📊 Deploying CreditScoring contract...");
    const CreditScoring = await hre.ethers.getContractFactory("CreditScoring");
    const creditScoring = await CreditScoring.deploy();
    await creditScoring.waitForDeployment();
    const creditScoringAddress = await creditScoring.getAddress();
    console.log("✅ CreditScoring deployed to:", creditScoringAddress);

    // Deploy MicroLending contract
    console.log("\n💳 Deploying MicroLending contract...");
    const MicroLending = await hre.ethers.getContractFactory("MicroLending");
    const microLending = await MicroLending.deploy(creditScoringAddress);
    await microLending.waitForDeployment();
    const microLendingAddress = await microLending.getAddress();
    console.log("✅ MicroLending deployed to:", microLendingAddress);

    // Fund the lending pool with 5 cUSD (for testing)
    console.log("\n💰 Funding lending pool with 5 cUSD...");
    const fundingAmount = hre.ethers.parseEther("5");
    const fundTx = await microLending.fundPool({ value: fundingAmount });
    await fundTx.wait();
    console.log("✅ Lending pool funded");

    // Deploy a sample MarketMind Agent (for demo purposes)
    console.log("\n🤖 Deploying sample MarketMind Agent...");
    const vendorAddress = deployer.address; // Using deployer as vendor for demo
    const agentIdPlaceholder = hre.ethers.ZeroAddress; // Will be replaced with Self Protocol ID

    const MarketMindAgent = await hre.ethers.getContractFactory("MarketMindAgent");
    const sampleAgent = await MarketMindAgent.deploy(vendorAddress, agentIdPlaceholder);
    await sampleAgent.waitForDeployment();
    const sampleAgentAddress = await sampleAgent.getAddress();
    console.log("✅ Sample MarketMind Agent deployed to:", sampleAgentAddress);

    // Set credit scoring contract in agent
    console.log("\n🔗 Connecting contracts...");
    const setCreditScoringTx = await sampleAgent.setCreditScoringContract(creditScoringAddress);
    await setCreditScoringTx.wait();

    // Register agent with credit scoring
    const registerTx = await creditScoring.registerAgent(sampleAgentAddress);
    await registerTx.wait();
    console.log("✅ Contracts connected and agent registered");

    // Save deployment addresses
    const network = await hre.ethers.provider.getNetwork();
    const deployment = {
        network: network.name,
        chainId: network.chainId.toString(),
        deployer: deployer.address,
        contracts: {
            CreditScoring: creditScoringAddress,
            MicroLending: microLendingAddress,
            SampleAgent: sampleAgentAddress,
        },
        timestamp: new Date().toISOString(),
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const deploymentFile = path.join(
        deploymentsDir,
        `deployment-${network.chainId}-${Date.now()}.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
    console.log("\n💾 Deployment info saved to:", deploymentFile);

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📋 Contract Addresses:");
    console.log("   CreditScoring:", creditScoringAddress);
    console.log("   MicroLending:", microLendingAddress);
    console.log("   Sample Agent:", sampleAgentAddress);
    console.log("\n📝 Next Steps:");
    console.log("   1. Update your .env file with these addresses");
    console.log("   2. Verify contracts on block explorer");
    console.log("   3. Set up the Eliza agent with these contract addresses");
    console.log("   4. Configure Self Protocol identity");
    console.log("\n" + "=".repeat(60) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
