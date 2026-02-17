export const NEXT_PUBLIC_CELO_RPC_URL = "https://forno.celo-sepolia.celo-testnet.org";
export const NEXT_PUBLIC_MARKETMIND_AGENT_ADDRESS = "0x308597EB73a6bA43DBaA658aD6f9292dBf428284";
export const NEXT_PUBLIC_CREDIT_SCORING_ADDRESS = "0x3B272C51f41f85d50220EeE2b4420709af295588";
export const NEXT_PUBLIC_MICRO_LENDING_ADDRESS = "0xa688063f5f9A0B2635F64E56e5975b9C958b220a";

export const AGENT_ABI = [
    "function creditScore() public view returns (uint256)",
    "function totalRevenue() public view returns (uint256)",
    "function totalCosts() public view returns (uint256)",
    "function getBalance() public view returns (uint256)",
    "function getProfitMargin() public view returns (uint256)",
    "function transactionCount() public view returns (uint256)",
    "function getTransaction(uint256) public view returns (tuple(uint256 id, uint256 amount, address counterparty, uint8 txType, uint256 timestamp, string description))"
];

export const LENDING_ABI = [
    "function checkEligibility(address) public view returns (bool eligible, tuple(uint256 maxAmount, uint256 interestRate, uint256 duration) terms)",
    "function lendingPoolBalance() public view returns (uint256)"
];
