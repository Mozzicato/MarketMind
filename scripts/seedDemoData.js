const { ethers } = require("hardhat");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    const agentAddress = process.env.MARKETMIND_AGENT_ADDRESS;
    const scoringAddress = process.env.CREDIT_SCORING_ADDRESS;

    if (!agentAddress || !scoringAddress) {
        console.error("Please set MARKETMIND_AGENT_ADDRESS and CREDIT_SCORING_ADDRESS in .env");
        return;
    }

    console.log("Using account:", deployer.address);
    console.log("Seeding data for agent:", agentAddress);

    // Use getAddress to ensure correct checksums
    const checkedAgentAddress = ethers.getAddress(agentAddress);
    const checkedScoringAddress = ethers.getAddress(scoringAddress);

    const Agent = await ethers.getContractAt("MarketMindAgent", checkedAgentAddress);
    const Scoring = await ethers.getContractAt("CreditScoring", checkedScoringAddress);

    // 1. Initial Funding (needed for supplier payments)
    console.log("Checking agent balance...");
    const balance = await ethers.provider.getBalance(checkedAgentAddress);
    if (balance < ethers.parseEther("3.0")) {
        console.log("Funding agent for initial stock...");
        const fundTx = await deployer.sendTransaction({
            to: checkedAgentAddress,
            value: ethers.parseEther("5.0")
        });
        await fundTx.wait();
        console.log("Funded.");
    }

    const suppliers = [
        { name: "Bala", item: "Tomatoes", amount: "1.5", quantity: 100 },
        { name: "Musa", item: "Onions", amount: "1.0", quantity: 80 },
        { name: "Chidi", item: "Peppers", amount: "0.5", quantity: 50 },
    ];

    for (const s of suppliers) {
        try {
            console.log(`Paying supplier ${s.name} for ${s.item}...`);
            const supplierAddr = ethers.getAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79ee");
            const tx = await Agent.paySupplier(
                supplierAddr,
                ethers.parseEther(s.amount),
                s.item,
                BigInt(s.quantity)
            );
            await tx.wait();
            console.log(`Paid ${s.name}.`);
        } catch (e) {
            console.error(`Error paying ${s.name}:`, e.message);
        }
    }

    // 2. Simulating Sales
    const sales = [
        { item: "Tomatoes", qty: 5, price: "0.2" },
        { item: "Tomatoes", qty: 10, price: "0.4" },
        { item: "Onions", qty: 2, price: "0.15" },
        { item: "Peppers", qty: 5, price: "0.1" },
        { item: "Tomatoes", qty: 3, price: "0.12" },
        { item: "Onions", qty: 8, price: "0.6" },
    ];

    for (const sale of sales) {
        try {
            console.log(`Recording sale: ${sale.qty} ${sale.item} for ${sale.price} cUSD...`);
            const tx = await Agent.recordSale(
                sale.item,
                BigInt(sale.qty),
                ethers.parseEther(sale.price)
            );
            await tx.wait();
        } catch (e) {
            console.error(`Error recording sale of ${sale.item}:`, e.message);
        }
    }

    // 3. Score Refresh
    console.log("Registering & Calculating score...");
    try {
        const regTx = await Scoring.registerAgent(checkedAgentAddress);
        await regTx.wait();
        const scoreTx = await Scoring.calculateScore(checkedAgentAddress);
        await scoreTx.wait();

        const newScore = await Agent.creditScore();
        console.log("--- SEEDING COMPLETE ---");
        console.log("New Credit Score:", newScore.toString());
    } catch (e) {
        console.error("Error updating score:", e.message);
    }
}

main().catch(console.error);
