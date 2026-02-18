import fs from "fs";

async function startVerification() {
    const keys = JSON.parse(fs.readFileSync("selfclaw_keys.json", "utf8"));

    const response = await fetch("https://selfclaw.ai/api/selfclaw/v1/start-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            agentPublicKey: keys.publicKey,
            agentName: "MarketMind"
        })
    });

    const data = await response.json();
    fs.writeFileSync("verification_session.json", JSON.stringify(data, null, 2));
    console.log("Session ID:", data.sessionId);
    console.log("Challenge:", data.challenge);
}

startVerification().catch(console.error);
