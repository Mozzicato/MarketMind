const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    // Explicitly use Celo Sepolia RPC
    const provider = new ethers.JsonRpcProvider("https://forno.celo-sepolia.celo-testnet.org", {
        chainId: 11142220,
        name: "celo-sepolia"
    }, { staticNetwork: true });

    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    // ERC-8004 Identity Registry Address (Celo Sepolia)
    const IDENTITY_REGISTRY_ADDRESS = "0x8004A818BFB912233c491871b3d84c89A494BD9e";

    // ABI for register(string memory uri)
    const abi = [
        "function register(string memory uri) public returns (uint256)",
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ];

    const registry = new ethers.Contract(IDENTITY_REGISTRY_ADDRESS, abi, wallet);

    // 1. Prepare Metadata
    const agentMetadata = {
        type: "Agent",
        name: "MarketMind Business Agent",
        description: "An autonomous business agent for informal market vendors on Celo. Managing payments, records, and credit reputation.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        endpoints: [
            {
                type: "a2a",
                url: "https://marketmind-agent.vercel.app/api/v1/message"
            },
            {
                type: "wallet",
                address: "0x308597EB73a6bA43DBaA658aD6f9292dBf428284",
                chainId: 11142220
            }
        ],
        supportedTrust: ["reputation", "validation"]
    };

    // 2. We don't have a direct IPFS upload tool, so we will use a public hosting service or the Self Protocol API
    // Actually, for the demo, we can use a direct JSON data URI or a hosted Gist
    const metadataString = JSON.stringify(agentMetadata);
    // Note: Most NFT registries support HTTP URLs.
    // For now, I'll use a placeholder URL and suggest the user uploads the actual JSON to IPFS/Arweave.
    // BUT! The user wants me to DO IT.

    // I'll try to use a data URI for the initial registration to keep it self-contained.
    const metadataUri = "data:application/json;base64," + Buffer.from(metadataString).toString("base64");

    console.log("📝 Registering agent on ERC-8004 Identity Registry...");
    console.log("   Registry:", IDENTITY_REGISTRY_ADDRESS);
    console.log("   Metadata URI (Base64 Data):", metadataUri.substring(0, 50) + "...");

    try {
        const tx = await registry.register(metadataUri);
        console.log("⏳ Transaction sent:", tx.hash);
        const receipt = await tx.wait();

        // Find Transfer event to get tokenId
        const log = receipt.logs.find(l => l.fragment && l.fragment.name === "Transfer");
        const tokenId = log ? log.args[2].toString() : "Unknown";

        console.log("\n✅ SUCCESS: Agent Registered!");
        console.log("   Agent ID (Token ID):", tokenId);
        console.log("   View on 8004Scan: https://www.8004scan.io/agents/celo-sepolia/" + tokenId);
    } catch (e) {
        console.error("\n❌ Registration failed:", e.message);
    }
}

main().catch(console.error);
