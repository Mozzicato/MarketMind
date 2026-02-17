const { ethers } = require("hardhat");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    const agentAddress = process.env.MARKETMIND_AGENT_ADDRESS;

    const checkedAgentAddress = ethers.getAddress(agentAddress.toLowerCase());
    const Agent = await ethers.getContractAt("MarketMindAgent", checkedAgentAddress);

    console.log("Boosting data for agent:", checkedAgentAddress);

    // Use lowercase to avoid checksum mismatch in getAddress source
    const supplierAddr = ethers.getAddress("0x70997970c51812dc3a010c7d01b50e0d17dc79ee");

    try {
        console.log("Paying supplier...");
        const tx1 = await Agent.paySupplier(
            supplierAddr,
            ethers.parseEther("0.1"),
            "Tomatoes",
            BigInt(10)
        );
        await tx1.wait();
        console.log("Supplier paid.");

        console.log("Recording sale...");
        const tx2 = await Agent.recordSale("Tomatoes", BigInt(1), ethers.parseEther("0.05"));
        await tx2.wait();
        console.log("Sale recorded.");

        console.log("Done boosting.");
    } catch (e) {
        console.error("Boosting error:", e.message);
    }
}

main().catch(console.error);
