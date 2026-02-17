import { IAgentRuntime, Memory, Provider, State } from "@ai16z/eliza";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const businessStateProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
            const agentContract = new ethers.Contract(
                process.env.MARKETMIND_AGENT_ADDRESS!,
                [
                    "function creditScore() public view returns (uint256)",
                    "function totalRevenue() public view returns (uint256)",
                    "function totalCosts() public view returns (uint256)",
                    "function getBalance() public view returns (uint256)",
                    "function getAllInventoryItems() public view returns (string[])",
                    "function getInventory(string item) public view returns (tuple(string item, uint256 quantity, uint256 costBasis, uint256 lastUpdated))"
                ],
                provider
            );

            const [score, revenue, costs, balance, items] = await Promise.all([
                agentContract.creditScore(),
                agentContract.totalRevenue(),
                agentContract.totalCosts(),
                agentContract.getBalance(),
                agentContract.getAllInventoryItems()
            ]);

            const inventorySummary = [];
            for (const item of items.slice(0, 3)) {
                const data = await agentContract.getInventory(item);
                inventorySummary.push(`${data.item}: ${data.quantity.toString()}`);
            }

            return `
Current Business State (Onchain):
- Reputation Score: ${score.toString()} (Max: 850)
- Wallet Balance: ${ethers.formatEther(balance)} cUSD
- Total Revenue: ${ethers.formatEther(revenue)} cUSD
- Total Costs: ${ethers.formatEther(costs)} cUSD
- Top Inventory: ${inventorySummary.length > 0 ? inventorySummary.join(", ") : "Empty"}
- Financial Model: Ethical & Interest-free
`;
        } catch (error) {
            console.error("Error in businessStateProvider:", error);
            return "Note: Onchain business context currently unavailable.";
        }
    }
};
