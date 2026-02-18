import { generateKeyPairSync } from "crypto";
import fs from "fs";
import path from "path";

const { publicKey, privateKey } = generateKeyPairSync("ed25519");

const publicKeySpki = publicKey.export({ type: "spki", format: "der" }).toString("base64");
const privateKeyPkcs8 = privateKey.export({ type: "pkcs8", format: "der" }).toString("base64");

const keys = {
    publicKey: publicKeySpki,
    privateKey: privateKeyPkcs8
};

fs.writeFileSync("selfclaw_keys.json", JSON.stringify(keys, null, 2));

console.log("Keys generated and saved to selfclaw_keys.json");
console.log("Public Key (SPKI):", publicKeySpki);
