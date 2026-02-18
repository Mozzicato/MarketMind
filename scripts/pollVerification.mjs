import fs from "fs";

async function poll() {
    const session = JSON.parse(fs.readFileSync("verification_session.json", "utf8"));
    const sessionId = session.sessionId;

    console.log(`Polling status for session: ${sessionId}`);

    const interval = setInterval(async () => {
        try {
            const response = await fetch(`https://selfclaw.ai/api/selfclaw/v1/verification-status/${sessionId}`);
            const data = await response.json();

            console.log(`Status: ${data.status}`);

            if (data.status === "verified") {
                console.log("SUCCESS: Agent verified on SelfClaw!");
                clearInterval(interval);

                // Final confirmation
                const keys = JSON.parse(fs.readFileSync("selfclaw_keys.json", "utf8"));
                const confirmResponse = await fetch(`https://selfclaw.ai/api/selfclaw/v1/agent?publicKey=${encodeURIComponent(keys.publicKey)}`);
                const confirmData = await confirmResponse.json();
                console.log("Agent Registry Data:", JSON.stringify(confirmData, null, 2));
            } else if (data.status === "expired") {
                console.log("FAILED: Session expired.");
                clearInterval(interval);
            }
        } catch (e) {
            console.error("Polling error:", e.message);
        }
    }, 5000);
}

poll().catch(console.error);
