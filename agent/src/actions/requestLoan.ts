import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const requestLoanAction: Action = {
    name: "REQUEST_LOAN",
    similes: ["GET_CAPITAL", "APPLY_FOR_LOAN", "NEED_FINANCING", "ETHICAL_FUNDING"],
    description: "Checks eligibility and processes a transparent, interest-free business loan for the vendor.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return text.includes("loan") || text.includes("capital") || text.includes("borrow");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text;
        const amountMatch = text.match(/(\d+)/);

        if (!amountMatch) {
            return {
                text: "To help with financing, could you tell me how much capital you need in cUSD?"
            };
        }

        const requestedAmount = parseInt(amountMatch[1]);
        const amountInWei = ethers.parseEther(requestedAmount.toString());

        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

            const lendingContract = new ethers.Contract(
                process.env.MICRO_LENDING_ADDRESS!,
                [
                    "function checkEligibility(address agent) public view returns (bool eligible, tuple(uint256 maxAmount, uint256 interestRate, uint256 duration) terms)",
                    "function requestLoan(uint256 amount) external"
                ],
                wallet
            );

            // 1. Check eligibility
            const [eligible, terms] = await lendingContract.checkEligibility(process.env.MARKETMIND_AGENT_ADDRESS);

            if (!eligible) {
                return {
                    text: "Based on your current business history, you aren't eligible for additional financing right now. Let's focus on consistent sales logging to build your score! 📈"
                };
            }

            const maxAmount = parseFloat(ethers.formatEther(terms.maxAmount));
            if (requestedAmount > maxAmount) {
                return {
                    text: `Based on your reputation, you qualify for up to ${maxAmount} cUSD. Would you like to proceed with that amount?`
                };
            }

            // 2. Process loan (Ethical/Interest-free logic)
            const tx = await lendingContract.requestLoan(amountInWei);
            await tx.wait();

            return {
                text: `Success! Your interest-free capital of ${requestedAmount} cUSD has been disbursed to your business wallet. Use it to scale your operations! 🤝🚀`,
                action: "REQUEST_LOAN_SUCCESS"
            };
        } catch (error) {
            console.error("Error requesting loan:", error);
            return {
                text: "I encountered an error while processing the request. Please try again in a moment."
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "I need 200 cUSD for a new generator" }
            },
            {
                user: "MarketMind",
                content: { text: "Checking your eligibility for interest-free financing...", action: "REQUEST_LOAN" }
            }
        ]
    ] as ActionExample[][]
};
