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
    handler: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        const text = message.content.text;

        // Extract amount and item
        // Expected usage: "MarketMind, pay Bala 30 cUSD for tomatoes"
        const amountMatch = text.match(/(\d+)\s+(cusd|celo|naira)/i);
        const itemMatch = text.match(/for\s+(\w+)/i);
        const supplierMatch = text.match(/pay\s+(\w+)/i);

        if (!amountMatch || !itemMatch || !supplierMatch) {
            return {
                text: "To pay a supplier, please specify the amount, the item, and who I'm paying. For example: 'Pay Bala 30 cUSD for onions'."
            };
        }

        const amount = parseInt(amountMatch[1]);
        const item = itemMatch[1];
        const supplierName = supplierMatch[1];

        // Mock supplier address lookup (In a real app, this would be in a DB)
        const supplierAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79ee";
        const amountInWei = ethers.parseEther(amount.toString());

        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const vendorWallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

            const agentContract = new ethers.Contract(
                process.env.MARKETMIND_AGENT_ADDRESS!,
                ["function paySupplier(address payable supplier, uint256 amount, string memory item, uint256 quantity) external"],
                vendorWallet
            );

            // Execute the payment
            // Note: In our contract, this is restricted to the human vendor (owner)
            // The AI provides the recommendation, and the vendor triggers it via this command.
            const tx = await agentContract.paySupplier(supplierAddress, amountInWei, item, 100); // quantity hardcoded for demo
            await tx.wait();

            return {
                text: `Bismillah, payment processed! I've sent ${amount} cUSD to ${supplierName} for ${item}. Your inventory has been updated onchain and the transaction is recorded in your business history. 🚚✅`,
                action: "PAY_SUPPLIER_SUCCESS"
            };
        } catch (error) {
            console.error("Error paying supplier:", error);
            return {
                text: `I couldn't process the payment to ${supplierName}. Please ensure there's enough balance in your agent wallet and that the supplier address is correct.`
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
                content: { text: "Processing payment to Bala now. I'll update you once the transfer is confirmed.", action: "PAY_SUPPLIER" }
            }
        ]
    ] as ActionExample[][]
};
