import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const getAdviceAction: Action = {
    name: "GET_BUSINESS_ADVICE",
    similes: ["OPTIMIZE_BUSINESS", "BUSINESS_TIPS", "GROW_MY_MARKET", "HOW_AM_I_DOING"],
    description: "Analyzes current onchain performance and inventory levels to provide actionable business growth advice.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return text.includes("advice") || text.includes("tips") || text.includes("how am i doing") || text.includes("optimize");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const agentContract = new ethers.Contract(
                process.env.MARKETMIND_AGENT_ADDRESS!,
                [
                    "function getProfitMargin() public view returns (uint256)",
                    "function getAllInventoryItems() public view returns (string[])",
                    "function getInventory(string item) public view returns (tuple(string item, uint256 quantity, uint256 costBasis, uint256 lastUpdated))"
                ],
                provider
            );

            const margin = await agentContract.getProfitMargin();
            const items = await agentContract.getAllInventoryItems();

            let advice = "";

            if (margin > 20) {
                advice += "Your profit margin is strong at " + margin + "%. You're in a great position to reinvest! ";
            } else {
                advice += "Your margin is currently " + margin + "%. We should look at reducing procurement costs or slightly adjusting prices. ";
            }

            if (items.length > 0) {
                const itemData = await agentContract.getInventory(items[0]);
                if (itemData.quantity < 20) {
                    advice += `\n\n⚠️ Low Stock Alert: You have less than 20 ${itemData.item} left. Based on your sales speed, you should restock today to avoid missing out on customers. Shall I prepare a payment for your supplier?`;
                }
            }

            advice += "\n\n💡 Pro Tip: Since the market is busy on weekends, try to increase your stock of perishable items by 15% on Friday mornings.";

            return {
                text: `Here is your MarketMind Business Growth Report:\n\n${advice}`,
                action: "GET_ADVICE_SUCCESS"
            };
        } catch (error) {
            console.error("Error getting advice:", error);
            return {
                text: "I'm still analyzing your latest data. Keep recording those sales and I'll have fresh advice for you tomorrow!"
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Agent, how is my business doing? Any tips?" }
            },
            {
                user: "MarketMind",
                content: { text: "Analyzing your recent sales and inventory patterns...", action: "GET_BUSINESS_ADVICE" }
            }
        ]
    ] as ActionExample[][]
};
