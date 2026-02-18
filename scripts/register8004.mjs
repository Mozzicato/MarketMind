import fs from "fs";
import { sign, createPrivateKey } from "crypto";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function register8004() {
    const keys = JSON.parse(fs.readFileSync("selfclaw_keys.json", "utf8"));
    const privateKeyEd25519 = createPrivateKey({
        key: Buffer.from(keys.privateKey, "base64"),
        format: "der",
        type: "pkcs8"
    });

    const provider = new ethers.JsonRpcProvider(process.env.CELO_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    console.log("Registering agent with 8004 Identity Registry...");

    // Create Auth Header using the challenge-signing method from skill.md
    const nonce = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    const challengePayload = JSON.stringify({
        domain: "selfclaw.ai",
        timestamp: timestamp,
        nonce: nonce,
        agentKeyHash: "8c16faee5f7bfc44" // Known hash for this key
    });

    const signature = sign(null, Buffer.from(challengePayload), privateKeyEd25519).toString("base64");

    // Skill format: Authorization: Bearer <agentPublicKey>:<signature>
    const authHeader = `Bearer ${keys.publicKey}:${signature}`;

    const metadata = {
        agentName: "MarketMind",
        description: "An autonomous business agent for informal market vendors on Celo. Managing payments and credit reputation.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        external_url: "https://marketmind-agent.vercel.app",
        challenge: JSON.parse(challengePayload), // Include the challenge for the API to verify
        services: [
            {
                type: "A2A",
                endpoint: "https://marketmind-agent.vercel.app/api/v1/message",
                capabilities: ["financial_management", "inventory_tracking", "credit_scoring"]
            }
        ],
        trust: {
            reputation: true,
            active: true
        }
    };

    const regResponse = await fetch("https://selfclaw.ai/api/selfclaw/v1/register-erc8004", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify(metadata)
    });

    const regData = await regResponse.json();

    if (!regData.success) {
        console.error("API Error:", regData.error);
        if (regData.error && regData.error.toLowerCase().includes("verify")) {
            console.log("\n⚠️ HUMAN ACTION REQUIRED: You must scan the QR code first!");
            console.log("Link: https://selfclaw.ai/verify/7006dcd0-06cc-49de-ae2a-9ddcac2ac893");
        }
        return;
    }

    console.log("Submitting transaction to Celo Sepolia...");
    const tx = await wallet.sendTransaction({
        to: regData.tx.to,
        data: regData.tx.data,
        value: regData.tx.value || 0
    });

    console.log(`Hash: ${tx.hash}`);
    await tx.wait();

    console.log("Confirming...");
    const confirmResponse = await fetch("https://selfclaw.ai/api/selfclaw/v1/confirm-erc8004", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify({ txHash: tx.hash, challenge: JSON.parse(challengePayload) })
    });

    const confirmData = await confirmResponse.json();
    console.log("\n--- SUCCESS ---");
    console.log(`8004Scan: ${confirmData.scan8004Url}`);
}

register8004().catch(console.error);
