import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const updateCreditScoreAction: Action = {
    name: "UPDATE_CREDIT_SCORE",
    similes: ["CALCULATE_SCORE", "REFRESH_REPUTATION", "CHECK_PROGRESS"],
    description: "Triggers a re-calculation of the vendor's onchain credit score based on recent performance.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return text.includes("credit score") || text.includes("update my score");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

            const scoringContract = new ethers.Contract(
                process.env.CREDIT_SCORING_ADDRESS!,
                ["function calculateScore(address agent) external returns (uint256)"],
                wallet
            );

            const tx = await scoringContract.calculateScore(process.env.MARKETMIND_AGENT_ADDRESS);
            const receipt = await tx.wait();

            // In a real environment, we'd parse the event for the new score
            // For now, we notify success and the business provider will handle the display in the next message
            return {
                text: "I've triggered a re-calculation of your onchain business reputation. Your latest performance metrics are being analyzed now. I'll have the updated score for you in a moment! 📈✨",
                action: "UPDATE_CREDIT_SCORE_SUCCESS"
            };
        } catch (error) {
            console.error("Error updating credit score:", error);
            return {
                text: "I couldn't update your credit score right now. Let's make sure more transactions have occurred before the next calculation."
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Agent, update my credit score" }
            },
            {
                user: "MarketMind",
                content: { text: "Recalculating your business reputation based on your sales and supplier payments...", action: "UPDATE_CREDIT_SCORE" }
            }
        ]
    ] as ActionExample[][]
};
