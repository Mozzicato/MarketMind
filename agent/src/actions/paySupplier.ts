import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const paySupplierAction: Action = {
    name: "PAY_SUPPLIER",
    similes: ["PURCHASE_STOCK", "RESTOCK", "PAY_VENDOR", "ORDER_ITEMS"],
    description: "Autonomously pays a supplier for inventory restocking. Requires explicit vendor approval context.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return text.includes("pay supplier") || text.includes("restock") || text.includes("order");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text;

        const amountMatch = text.match(/(\d+)\s+(cusd|celo|naira)/i);
        const itemMatch = text.match(/for\s+(\w+)/i);
        const supplierMatch = text.match(/pay\s+(\w+)/i);

        if (!amountMatch || !itemMatch || !supplierMatch) {
            return {
                text: "To process a payment, please specify the amount, item, and supplier name. Example: 'Pay Bala 30 cUSD for onions'."
            };
        }

        const amount = parseInt(amountMatch[1]);
        const item = itemMatch[1];
        const supplierName = supplierMatch[1];
        const supplierAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79ee"; // Example address
        const amountInWei = ethers.parseEther(amount.toString());

        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const vendorWallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

            const agentContract = new ethers.Contract(
                process.env.MARKETMIND_AGENT_ADDRESS!,
                ["function paySupplier(address payable supplier, uint256 amount, string memory item, uint256 quantity) external"],
                vendorWallet
            );

            const tx = await agentContract.paySupplier(supplierAddress, amountInWei, item, 100);
            await tx.wait();

            return {
                text: `Payment sent! I've transferred ${amount} cUSD to ${supplierName} for ${item}. Business history and inventory have been updated onchain. 🚚✅`,
                action: "PAY_SUPPLIER_SUCCESS"
            };
        } catch (error) {
            console.error("Error paying supplier:", error);
            return {
                text: `Failed to process payment to ${supplierName}. Check your wallet balance and try again.`
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Yes, pay Bala 30 cUSD for the tomatoes" }
            },
            {
                user: "MarketMind",
                content: { text: "Sending payment to Bala now. Your inventory will be updated shortly.", action: "PAY_SUPPLIER" }
            }
        ]
    ] as ActionExample[][]
};
