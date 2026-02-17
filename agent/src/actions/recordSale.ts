import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const recordSaleAction: Action = {
    name: "RECORD_SALE",
    similes: ["LOG_SALE", "SELL_ITEM", "TRACK_REVENUE"],
    description: "Records a business sale, updates onchain transaction history, and manages inventory levels.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Check if message contains sales keywords
        const text = message.content.text.toLowerCase();
        return text.includes("sold") || text.includes("sale") || text.includes("selling");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text;

        // Simple NLP extraction (can be improved with LLM)
        // Expected format: "I sold 20 tomatoes for 2000 naira"
        const quantityMatch = text.match(/(\d+)\s+(\w+)/);
        const priceMatch = text.match(/(\d+)\s+(naira|cusd|dollar)/i);

        if (!quantityMatch || !priceMatch) {
            return {
                text: "I couldn't quite catch the details. Could you tell me exactly what you sold, how many, and for how much? For example: 'I sold 10 tomatoes for 500 naira'."
            };
        }

        const quantity = parseInt(quantityMatch[1]);
        const item = quantityMatch[2];
        const priceInNaira = parseInt(priceMatch[1]);

        // Convert Naira to Wei (Mock conversion for demo, 1 cUSD = 1500 Naira)
        const priceInWei = ethers.parseEther((priceInNaira / 1500).toString());

        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
            const agentContract = new ethers.Contract(
                process.env.MARKETMIND_AGENT_ADDRESS!,
                ["function recordSale(string item, uint256 quantity, uint256 price) external"],
                wallet
            );

            // Execute onchain transaction
            const tx = await agentContract.recordSale(item, quantity, priceInWei);
            await tx.wait();

            return {
                text: `Successfully recorded sale of ${quantity} ${item} for ${priceInNaira} Naira. Onchain transaction confirmed. I've updated your inventory and revenue metrics! 📈`,
                action: "RECORD_SALE_SUCCESS"
            };
        } catch (error) {
            console.error("Error recording sale:", error);
            return {
                text: "I had some trouble recording that on the blockchain. Let me try again in a moment, or check my connection."
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Agent, I just sold 10 bags of rice for 15,000 naira" }
            },
            {
                user: "MarketMind",
                content: { text: "Recording that now! I've updated your rice inventory and added the revenue to your onchain profile.", action: "RECORD_SALE" }
            }
        ]
    ] as ActionExample[][]
};
