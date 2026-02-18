import fs from "fs";
import { sign, createPrivateKey } from "crypto";

async function signChallenge() {
    const keys = JSON.parse(fs.readFileSync("selfclaw_keys.json", "utf8"));
    const session = JSON.parse(fs.readFileSync("verification_session.json", "utf8"));

    const privateKey = createPrivateKey({
        key: Buffer.from(keys.privateKey, "base64"),
        format: "der",
        type: "pkcs8"
    });

    const challengeBuffer = Buffer.from(session.challenge);
    const signature = sign(null, challengeBuffer, privateKey).toString("base64");

    console.log("Signature (base64):", signature);

    const response = await fetch("https://selfclaw.ai/api/selfclaw/v1/sign-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId: session.sessionId,
            signature: signature
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

signChallenge().catch(console.error);
