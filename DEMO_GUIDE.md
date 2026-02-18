# MarketMind: Agentic Commerce Demo 🚀

This guide will help you restart and present the MarketMind demo flawlessly.

## 🛠️ Step 1: Clean Restart

First, you need to ensure all processes are fresh.

1.  **Stop everything**: Go to your open terminal windows (e.g., `npm run dev`) and press **Ctrl + C** multiple times to kill the running processes.
2.  **Verify Configuration**: Ensure your `.env` file and `frontend/lib/contracts.ts` have:
    *   **RPC**: `https://forno.celo-sepolia.celo-testnet.org`
    *   **Agent Address**: `0x308597EB73a6bA43DBaA658aD6f9292dBf428284`

## 🎬 Step 2: Start the Engine

Open two terminal tabs in VS Code or your terminal:

**Terminal 1 (Frontend - The "Face"):**
1.  Open a terminal.
2.  Type: `cd frontend`
3.  Type: `npm run dev`
4.  **Leave this running.** Do not close it.

**Terminal 2 (Autonomous Brain - The "Mind"):**
1.  Click the `+` icon or `Ctrl + Shift + \`` to open a **NEW** terminal tab.
2.  Ensure you are in the main `MarketMind` folder (not inside `frontend`).
3.  Type: `node scripts/run_autonomous_agent.js`
4.  **Leave this running.** This shows the agent thinking and acting.

**Terminal 3 (Helper - The "Keys"):**
1.  Open another **NEW** terminal tab.
2.  Type: `node scripts/demo_links.js`
3.  This just prints the links you need to click (Blockscout, etc). You can close this one after clicking.


## 🎤 Step 3: The Demo Walkthrough

### Act 1: The Problem & Solution
*   **Narrative**: "Informal vendors struggle with credit access because they lack verifiable records. MarketMind gives them an autonomous AI agent that runs their business on-chain, building trust automatically."
*   **Show**: Open `http://localhost:3000` (The Dashboard).

### Act 2: Live On-Chain Identity (ERC-8004)
*   **Narrative**: "This isn't just a database entry. The agent is a sovereign entity registered on the Celo blockchain using the new ERC-8004 standard."
*   **Action**: Click the link from `node scripts/demo_links.js` labeled **"Agent Identity (ERC-8004)"**.
*   **Show**: The Blockscout page showing your **Token ID #31**. Point out the owner address matching your deployment.

### Act 3: Agentic Capabilities
*   **Narrative**: "The agent autonomously tracks sales and calculates credit scores."
*   **Action**: Use the "Voice Simulator" at the bottom of the dashboard. Type: *"I sold 50 units for 200 cUSD"*.
*   **Result**: Watch the simulated chat response. Explain that this data is verified on-chain to update the "Credit Reputation" score at the top.

### Act 4: Real Autonomous Actions 🤖
*   **Narrative**: "To prove this isn't just a UI, let's turn on the agent's autonomous brain."
*   **Action**: Open a new terminal tab and run:
    ```bash
    node scripts/run_autonomous_agent.js
    ```
*   **Show**: The terminal output. It will connect to the Celo blockchain and start monitoring.
*   **Highlight**: Wait for a **"LOW STOCK ALERT!"** or **"UPDATE CREDIT SCORE"** event.
    *   Explain: "It just detected a low inventory signal and autonomously executed an on-chain payment to restock, without me clicking anything."

### Act 5: The Developer Experience (Optional)
*   **Show**: Briefly show your `contracts/MarketMindAgent.sol` or `agent.json` to prove it's real code.
*   **Tech Stack**: Mention "Built with Celo Agent Skills, Hardhat, and Next.js".

## 🐛 Troubleshooting

*   **"404" on 8004Scan**: Use the **Blockscout** link instead. The 8004Scan explorer is currently indexing only the Alfajores testnet, while we deployed to the newer Sepolia testnet for future compatibility.
*   **Frontend Error**: If the dashboard shows 0 values, ensure you are connected to the internet and the RPC URL in `.env` is accessible.

**Good luck with the demo! 🚀**
