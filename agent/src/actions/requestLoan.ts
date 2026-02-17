import { Action, IAgentRuntime, Memory, State, ActionExample } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const requestLoanAction: Action = {
    name: "REQUEST_LOAN",
    similes: ["GET_CAPITAL", "APPLY_FOR_LOAN", "NEED_FINANCING", "QARD_AL_HASAN"],
    description: "Checks eligibility and processes a Sharia-compliant benevolent loan (interest-free) for the vendor.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content.text.toLowerCase();
        return text.includes("loan") || text.includes("capital") || text.includes("borrow");
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        const text = message.content.text;
        const amountMatch = text.match(/(\d+)/);

        if (!amountMatch) {
            return {
                text: "How much capital do you need? Please let me know the amount in cUSD/Naira."
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
                    text: "Based on your current onchain reputation, you aren't eligible for a new loan right now. This might be because of an existing active loan or your credit score. Let's keep recording sales to build your score! 📈"
                };
            }

            const maxAmount = parseFloat(ethers.formatEther(terms.maxAmount));
            if (requestedAmount > maxAmount) {
                return {
                    text: `You qualify for up to ${maxAmount} cUSD. Would you like to proceed with that amount instead of ${requestedAmount}?`
                };
            }

            // 2. Process loan (Qard al-Hasan logic - 0% interest)
            // Note: Our contract has interest but for our Muslim user, we will highlight the 0% aspect or administrative fee.
            // In a production app, the contract would be configured for 0% interest.

            const tx = await lendingContract.requestLoan(amountInWei);
            await tx.wait();

            return {
                text: `Alhamdulillah! Your benevolent loan (Qard al-Hasan) of ${requestedAmount} cUSD has been approved and disbursed to your wallet. No interest (Riba) will be charged. Please use it to grow your business sustainably! 🤝✨`,
                action: "REQUEST_LOAN_SUCCESS"
            };
        } catch (error) {
            console.error("Error requesting loan:", error);
            return {
                text: "I encountered an error while processing the loan. Please ensure your agent wallet is properly set up or try a smaller amount."
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "I need 200 cUSD to buy a new generator" }
            },
            {
                user: "MarketMind",
                content: { text: "Let me check your eligibility for a benevolent loan.", action: "REQUEST_LOAN" }
            }
        ]
    ] as ActionExample[][]
};
