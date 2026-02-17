# MarketMind Build Journey - Step-by-Step Walkthrough
## Your Exact Journey From Zero to Submitted

---

## 🗺️ THE COMPLETE JOURNEY MAP

```
START HERE
    ↓
1. Set up wallet (15 min)
    ↓
2. Get free test money (5 min)
    ↓
3. LLM writes smart contracts (30 min)
    ↓
4. Deploy contracts to blockchain (20 min)
    ↓
5. LLM writes agent code (45 min)
    ↓
6. Run agent locally (30 min)
    ↓
7. LLM writes web interface (30 min)
    ↓
8. Deploy website (20 min)
    ↓
9. Test everything works (1 hour)
    ↓
10. Self Protocol verification (15 min)
    ↓
11. Record demo video (1.5 hours)
    ↓
12. Submit to hackathon (1 hour)
    ↓
YOU'RE DONE! 🎉
```

**Total time: ~6-8 hours**

---

## STEP 1: SET UP YOUR WALLET (15 minutes)

### What you're doing:
Creating a digital wallet to hold cryptocurrency and deploy contracts.

### Exact steps:

**1.1** Open your browser (Chrome recommended)

**1.2** Go to: https://metamask.io/download/

**1.3** Click "Install MetaMask for Chrome"

**1.4** Click "Add to Chrome" → "Add Extension"

**1.5** MetaMask will open. Click "Create a new wallet"

**1.6** Click "I agree" to terms

**1.7** Create a password (write it down!)

**1.8** **CRITICAL:** MetaMask shows 12 words (your "seed phrase")
- Write these 12 words on paper IN ORDER
- Keep this paper safe (if you lose it, you lose everything)
- Never share it with anyone
- Example: `apple banana cat dog elephant...`

**1.9** Confirm the seed phrase by selecting words in order

**1.10** Click "Got it!" 

**1.11** You now see your wallet! It shows:
- Your address (starts with `0x...`)
- Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`

**1.12** Click the address to copy it. Paste it somewhere safe (you'll need it)

✅ **Checkpoint:** You have a wallet address starting with `0x`

---

## STEP 2: ADD CELO TESTNET & GET FREE MONEY (10 minutes)

### What you're doing:
Adding the Celo test network to MetaMask and getting free fake money to use.

### Exact steps:

**2.1** In MetaMask, click the network dropdown (top left, says "Ethereum Mainnet")

**2.2** Click "Add network"

**2.3** Click "Add a network manually" at the bottom

**2.4** Fill in these EXACT details:
```
Network Name: Celo Alfajores Testnet
New RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol: CELO
Block Explorer URL: https://alfajores.celoscan.io
```

**2.5** Click "Save"

**2.6** MetaMask will switch to Celo Alfajores Testnet (you'll see it in the dropdown)

**2.7** Open new tab, go to: https://faucet.celo.org/alfajores

**2.8** Paste your wallet address (the `0x...` you copied earlier)

**2.9** Click "Get CELO"

**2.10** Wait 30 seconds

**2.11** Click "Get cUSD" (this is the stablecoin you'll use)

**2.12** Wait 30 seconds

**2.13** Check MetaMask - you should now see:
- ~5 CELO (for gas fees)
- ~10 cUSD (for testing payments)

✅ **Checkpoint:** MetaMask shows CELO and cUSD balances

---

## STEP 3: SET UP CODING ENVIRONMENT (15 minutes)

### What you're doing:
Setting up a place to write and run code.

### Option A: Online (Easier - No Installation)

**3.1** Go to: https://replit.com

**3.2** Click "Sign up" (use GitHub, Google, or email)

**3.3** Click "Create Repl"

**3.4** Select "Node.js" template

**3.5** Name it: `marketmind-agent`

**3.6** Click "Create Repl"

**3.7** You now see a code editor in your browser!

✅ **Checkpoint:** You have a Replit workspace open

---

### Option B: Local (If you prefer coding on your computer)

**3.1** Download Node.js from: https://nodejs.org
- Click the big green button (LTS version)
- Install it (keep clicking "Next")

**3.2** Download VS Code from: https://code.visualstudio.com
- Install it

**3.3** Open Terminal (Mac) or Command Prompt (Windows)

**3.4** Type:
```bash
mkdir marketmind
cd marketmind
```

**3.5** Open VS Code, click "File" → "Open Folder" → Select `marketmind` folder

✅ **Checkpoint:** You have VS Code open with an empty folder

---

## STEP 4: LLM WRITES SMART CONTRACTS (30 minutes)

### What you're doing:
Getting AI to write the blockchain code for you.

### Exact steps:

**4.1** Open ChatGPT (chat.openai.com) or Claude (claude.ai) in a new tab

**4.2** Copy and paste this EXACT prompt:

```
I'm building MarketMind for Celo's hackathon. I need smart contracts deployed on Celo Alfajores testnet.

Write me:
1. MarketMindAgent.sol - An ERC-8004 agent wallet that can:
   - Accept cUSD payments (acceptPayment function)
   - Pay suppliers (paySupplier function)  
   - Track inventory (recordSale function)
   - Calculate credit score (updateCreditScore function)

2. Deployment script using Hardhat for Celo Alfajores testnet

3. hardhat.config.js configured for Celo Alfajores

4. Step-by-step instructions to deploy

Requirements:
- Solidity 0.8.20
- Include detailed comments
- Make it secure (prevent reentrancy)
- Keep it simple (I'm learning)

Also give me the exact commands to run.
```

**4.3** LLM will respond with code. You'll get:
- `MarketMindAgent.sol` (the smart contract)
- `hardhat.config.js` (configuration file)
- `deploy.js` (deployment script)
- Installation commands

**4.4** Copy each file the LLM gives you

**4.5** In Replit or VS Code:
- Create new file: `contracts/MarketMindAgent.sol`
- Paste the contract code
- Create new file: `hardhat.config.js`
- Paste the config code
- Create new file: `scripts/deploy.js`
- Paste the deployment script

✅ **Checkpoint:** You have 3 files with code from LLM

---

## STEP 5: DEPLOY SMART CONTRACTS TO BLOCKCHAIN (20 minutes)

### What you're doing:
Putting your contract on the Celo blockchain so it can run.

### Exact steps:

**5.1** In Replit/VS Code, open the Terminal (bottom panel)

**5.2** Install Hardhat and dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```
Wait for it to finish (might take 2-3 minutes)

**5.3** Create a `.env` file in your project root

**5.4** In MetaMask, click the three dots → "Account details" → "Show private key"

**5.5** Enter your password, copy the private key (starts with `0x...`)

**5.6** In `.env` file, paste:
```
PRIVATE_KEY=your_private_key_here
```
Replace `your_private_key_here` with the actual key you copied

⚠️ **IMPORTANT:** Never share this file or commit it to GitHub!

**5.7** In terminal, run:
```bash
npx hardhat compile
```
You should see: "Compiled 1 Solidity file successfully"

**5.8** Deploy to testnet:
```bash
npx hardhat run scripts/deploy.js --network alfajores
```

**5.9** Wait 30 seconds. You'll see output like:
```
MarketMindAgent deployed to: 0xABC123456789...
```

**5.10** **COPY THIS ADDRESS!** Paste it somewhere safe. This is your contract address.

**5.11** Verify it worked - go to:
```
https://alfajores.celoscan.io/address/YOUR_CONTRACT_ADDRESS
```
Replace `YOUR_CONTRACT_ADDRESS` with the address you got

You should see your contract on the blockchain explorer!

✅ **Checkpoint:** You have a deployed contract address starting with `0x`

---

## STEP 6: LLM WRITES AGENT CODE (45 minutes)

### What you're doing:
Getting AI to write the autonomous agent that runs your business logic.

### Exact steps:

**6.1** Go back to ChatGPT/Claude

**6.2** Paste this prompt:
```
Great! My contract is deployed at: 0xABC123456789... (paste your actual address)

Now write me an AI agent using Eliza framework that:

1. Monitors the contract for incoming cUSD payments
2. Records transactions onchain  
3. Calculates credit score based on:
   - Number of transactions (30%)
   - Payment reliability (25%)
   - Revenue consistency (20%)
4. Sends alerts when stock is low
5. Pays suppliers when approved

Use:
- Eliza framework (https://github.com/ai16z/eliza)
- Connect to Celo Alfajores testnet
- My contract address: 0xABC123... (paste your actual address)
- Anthropic Claude API for intelligence

Provide:
1. Complete folder structure
2. All code files
3. package.json with dependencies
4. .env.example file
5. README with run instructions

Keep it simple - I'm learning!
```

**6.3** LLM will give you a complete project structure. It'll look like:
```
agent/
├── src/
│   ├── index.js
│   ├── actions/
│   │   ├── acceptPayment.js
│   │   ├── paySupplier.js
│   │   └── creditScore.js
│   └── config/
│       └── celo.js
├── package.json
└── .env.example
```

**6.4** Create a new folder called `agent` in your project

**6.5** Copy each file from LLM into the `agent/` folder

**6.6** Create `.env` file in `agent/` folder:
```
ANTHROPIC_API_KEY=your_claude_api_key
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
CONTRACT_ADDRESS=0xABC123... (your contract address)
AGENT_PRIVATE_KEY=your_private_key (same as before)
```

To get Claude API key:
- Go to: https://console.anthropic.com
- Sign in
- Click "Get API Keys"
- Create new key, copy it

**6.7** In terminal, navigate to agent folder:
```bash
cd agent
```

**6.8** Install dependencies:
```bash
npm install
```

**6.9** Start the agent:
```bash
npm start
```

**6.10** You should see output like:
```
✅ Agent started
✅ Connected to Celo Alfajores
✅ Monitoring contract: 0xABC123...
✅ Ready to accept payments
```

✅ **Checkpoint:** Agent is running and monitoring your contract

---

## STEP 7: LLM WRITES WEB INTERFACE (30 minutes)

### What you're doing:
Creating a simple website vendors can use to interact with their agent.

### Exact steps:

**7.1** Go back to ChatGPT/Claude

**7.2** Paste this prompt:
```
Perfect! My agent is running. Now I need a mobile-friendly web interface.

Create a React app that:

1. Shows vendor dashboard:
   - cUSD balance
   - Credit score (big number, 300-850)
   - Today's sales
   - Recent transactions (last 10)

2. Payment QR code:
   - Generate QR code with agent wallet address
   - Customers scan to pay

3. Connect wallet button (MetaMask)

4. View inventory status

Tech stack:
- React 18
- Tailwind CSS for styling
- Wagmi for Web3 (connect to Celo)
- QR code library
- Mobile-first design (works on phones)

Contract address: 0xABC123... (paste your address)

Provide:
1. Complete React project structure
2. All components
3. package.json
4. Instructions to run and deploy to Vercel (free hosting)
```

**7.3** LLM gives you a React project. Structure looks like:
```
web/
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── QRCode.js
│   │   └── Transactions.js
│   └── index.js
├── package.json
└── public/
```

**7.4** Open new terminal (don't close the agent one!)

**7.5** Create the web app:
```bash
cd ..  (go back to main folder)
npx create-react-app web
cd web
```

**7.6** Replace the files with what LLM gave you:
- Copy `App.js` content → paste into `src/App.js`
- Create component files in `src/components/`
- Copy each component code

**7.7** Install dependencies:
```bash
npm install wagmi viem @tanstack/react-query qrcode.react
```

**7.8** Test locally:
```bash
npm start
```

Browser opens at `http://localhost:3000` - you should see your dashboard!

✅ **Checkpoint:** Web app running locally, showing dashboard

---

## STEP 8: DEPLOY WEBSITE TO INTERNET (20 minutes)

### What you're doing:
Putting your website online so judges can see it.

### Exact steps:

**8.1** Go to: https://vercel.com

**8.2** Click "Sign Up" (use GitHub account - easiest)

**8.3** Install Vercel CLI in your terminal:
```bash
npm i -g vercel
```

**8.4** In your web folder, run:
```bash
vercel
```

**8.5** Answer the prompts:
```
Set up and deploy? Y
Which scope? (your username)
Link to existing project? N
What's your project's name? marketmind-web
In which directory is your code? ./
Want to override settings? N
```

**8.6** Vercel deploys your app (takes 1-2 minutes)

**8.7** You get a URL like: `https://marketmind-web.vercel.app`

**8.8** Open that URL - your website is LIVE! 🎉

**8.9** Test it:
- Connect MetaMask wallet
- Should show your balance
- Should show QR code for payments

✅ **Checkpoint:** Website live at https://yourproject.vercel.app

---

## STEP 9: TEST EVERYTHING WORKS (1 hour)

### What you're doing:
Making sure the whole system works end-to-end.

### Test #1: Accept a Payment

**9.1** Open your website: `https://marketmind-web.vercel.app`

**9.2** Click "Connect Wallet" → approve in MetaMask

**9.3** You should see:
- Your balance (10 cUSD from faucet)
- Credit score (probably 300, just started)
- QR code

**9.4** Open MetaMask, copy your agent's wallet address (from the contract)

**9.5** Send yourself 1 cUSD:
- In MetaMask, click "Send"
- Paste agent address
- Amount: 1 cUSD
- Click "Confirm"

**9.6** Wait 10 seconds

**9.7** Check agent terminal - should print:
```
✅ Payment received: 1 cUSD from 0x...
✅ Transaction recorded onchain
```

**9.8** Refresh your website - balance should show +1 cUSD!

✅ **Test passed:** Payment system works!

---

### Test #2: Check on Blockchain Explorer

**9.9** Go to: `https://alfajores.celoscan.io/address/YOUR_CONTRACT_ADDRESS`

**9.10** Click "Transactions" tab

**9.11** You should see your 1 cUSD payment transaction!

✅ **Test passed:** Transactions recording onchain!

---

### Test #3: Credit Score Updates

**9.12** Send 2-3 more small payments (0.5 cUSD each)

**9.13** Check agent logs - should calculate credit score

**9.14** Refresh dashboard - credit score should increase (e.g., 300 → 325)

✅ **Test passed:** Credit scoring works!

---

## STEP 10: SELF PROTOCOL VERIFICATION (15 minutes)

### What you're doing:
Registering your agent identity (required for hackathon).

### Option A: If Self app works in Nigeria

**10.1** Download Self app from: https://self.xyz

**10.2** Follow their verification process

**10.3** Get your agentId from Self Protocol

**10.4** Save this agentId - you'll need it for submission

---

### Option B: If Self app doesn't work in Nigeria (LIKELY)

**10.1** Try to download Self app

**10.2** When it says "Not available in your region"

**10.3** Take a screenshot of this message

**10.4** Save the screenshot - you'll submit this instead (hackathon FAQ says this is OK!)

✅ **Checkpoint:** You have agentId OR screenshot showing unavailability

---

## STEP 11: RECORD DEMO VIDEO (1.5 hours)

### What you're doing:
Creating a video showing your agent working.

### Exact steps:

**11.1** Download OBS Studio (free screen recorder):
- Go to: https://obsproject.com
- Download and install

**11.2** Open OBS, click "Start Recording"

**11.3** Record this sequence (3 minutes total):

**Scene 1: Introduction (30 seconds)**
- Show your website homepage
- Say: "This is MarketMind, an AI agent that helps vendors accept payments and build credit"
- Show the dashboard with balance and credit score

**Scene 2: Accept Payment (1 minute)**
- Show the QR code on screen
- Open MetaMask in another window
- Send 1 cUSD to the agent
- Switch back to dashboard
- Show transaction appearing in real-time
- Point out: "Agent automatically recorded this onchain"

**Scene 3: View on Blockchain (30 seconds)**
- Open: `alfajores.celoscan.io/address/YOUR_CONTRACT`
- Show the transaction on the blockchain explorer
- Say: "Every transaction is verified and transparent"

**Scene 4: Credit Score (30 seconds)**
- Show dashboard with updated credit score
- Say: "Each payment builds the vendor's credit history"
- Show credit score: "From 300 to 345 in just 3 transactions"

**Scene 5: Future Vision (30 seconds)**
- Show agent in terminal monitoring
- Say: "This agent operates 24/7, building financial identity for informal vendors"
- Show your Twitter handle and "Built on Celo"

**11.4** Click "Stop Recording" in OBS

**11.5** Find the video file (usually in Videos folder)

**11.6** Upload to YouTube:
- Go to: youtube.com
- Click "Create" → "Upload video"
- Upload your recording
- Title: "MarketMind - AI Agent for Informal Vendors | Celo Hackathon"
- Set to "Unlisted" (judges can still see it)
- Copy the YouTube URL

✅ **Checkpoint:** Demo video uploaded to YouTube

---

## STEP 12: REGISTER ON 8004SCAN (10 minutes)

### What you're doing:
Adding your agent to the ERC-8004 registry.

### Exact steps:

**12.1** Go to: https://8004scan.io

**12.2** Click "Register Agent" or "Add Agent"

**12.3** Fill in:
- Agent wallet address: (your contract address)
- Agent name: MarketMind
- Description: "Autonomous business agent for informal vendors"
- Network: Celo Alfajores

**12.4** Submit

**12.5** Copy your agent's 8004scan.io URL

Example: `https://8004scan.io/agent/0xABC123...`

✅ **Checkpoint:** Agent visible on 8004scan.io

---

## STEP 13: CREATE KARMA PROJECT (30 minutes)

### What you're doing:
Registering your project officially for the hackathon.

### Exact steps:

**13.1** Go to: https://www.karmahq.xyz/community/celo?programId=1044

**13.2** Click "Submit Project" or "Register"

**13.3** Fill in project details:

**Project Name:** MarketMind

**Tagline:** "AI agent that turns informal vendors into creditworthy businesses"

**Description:** (copy from your strategy doc, about 500 words)
```
MarketMind is an autonomous AI agent built on Celo that enables informal 
market vendors to accept stablecoin payments, track revenue, manage inventory, 
and build onchain credit reputation.

[Copy rest from your refined description]
```

**13.4** Add links:
- GitHub: (upload your code to GitHub first)
- Demo Video: (your YouTube link)
- Live Website: https://marketmind-web.vercel.app
- Agent on 8004scan: https://8004scan.io/agent/0x...

**13.5** Upload screenshots:
- Dashboard showing balance and credit score
- QR code payment screen
- Transaction history
- Agent terminal running

**13.6** Select Track: "Best Agent on Celo"

**13.7** Submit project

**13.8** Copy your Karma project URL

✅ **Checkpoint:** Project live on Karma

---

## STEP 14: UPLOAD CODE TO GITHUB (20 minutes)

### What you're doing:
Sharing your code publicly (required for submission).

### Exact steps:

**14.1** Go to: https://github.com

**14.2** Sign in (create account if needed)

**14.3** Click "New repository"

**14.4** Name: `marketmind-agent`

**14.5** Description: "AI agent for informal vendors - Celo Hackathon 2026"

**14.6** Make it "Public"

**14.7** Click "Create repository"

**14.8** In your project terminal:
```bash
git init
git add .
git commit -m "Initial commit - MarketMind agent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marketmind-agent.git
git push -u origin main
```

**14.9** Refresh GitHub - your code is now uploaded!

**14.10** Add a README.md file on GitHub:
- Click "Add file" → "Create new file"
- Name it: `README.md`
- Paste your project description and setup instructions
- Commit

✅ **Checkpoint:** Code on GitHub with README

---

## STEP 15: CRAFT SUBMISSION TWEET (20 minutes)

### What you're doing:
Creating the official submission tweet with all requirements.

### Exact steps:

**15.1** Open Twitter/X

**15.2** Create a new tweet with this template:

```
🚀 Just shipped MarketMind for @Celo Real World Agents Hackathon!

An AI agent that turns street vendors into creditworthy businesses—one cUSD transaction at a time.

💰 Accept stablecoin payments
📊 Build onchain credit score  
🤖 Autonomous supplier payments
💳 Unlock micro-loans

2B informal workers deserve financial identity.

✅ Karma: [paste your Karma URL]
✅ Agent ID: [paste your agentId OR "Self not available in Nigeria - see submission"]
✅ Demo: [paste YouTube link]
✅ GitHub: [paste GitHub link]
✅ Live: https://marketmind-web.vercel.app

@CeloDevs #BuildOnCelo #RealWorldAgents
```

**15.3** Add 4 images/screenshots:
1. Dashboard with credit score
2. QR code payment screen
3. Transaction on blockchain explorer
4. Agent terminal running

**15.4** Review everything one more time

**15.5** Click "Post"

**15.6** Copy the tweet URL

✅ **Checkpoint:** Tweet posted with all required elements

---

## STEP 16: JOIN TELEGRAM & ANNOUNCE (10 minutes)

### What you're doing:
Joining the hackathon community and sharing your project.

### Exact steps:

**16.1** Go to: https://t.me/realworldagentshackathon

**16.2** Click "Join Group"

**16.3** Post introduction:
```
Hey everyone! 👋

Just submitted MarketMind - an AI agent that helps informal vendors 
build credit by accepting cUSD payments.

From Nigeria, targeting the 85% of workers in the informal sector here.

Karma: [link]
Demo: [link]

Happy to answer questions! 🚀
```

✅ **Checkpoint:** Active in Telegram group

---

## STEP 17: OPTIONAL - REGISTER ON MOLTHUNT (10 minutes)

### What you're doing:
Extra visibility for your project (optional but recommended).

### Exact steps:

**17.1** Go to: https://www.molthunt.com

**17.2** Click "Submit Agent" or "Register"

**17.3** Fill in agent details:
- Name: MarketMind
- Description: (same as Karma)
- Website: https://marketmind-web.vercel.app
- Twitter: (your account)

**17.4** Submit

✅ **Checkpoint:** Listed on Molthunt

---

## STEP 18: FINAL CHECKLIST (15 minutes)

### What you're doing:
Making absolutely sure you've submitted everything.

### Go through this checklist:

```
TECHNICAL:
✅ Smart contracts deployed to Celo Alfajores
✅ Contract address saved and verified on Celoscan
✅ Agent running and monitoring contract
✅ Website deployed to Vercel and accessible
✅ End-to-end payment flow tested and working

SUBMISSION:
✅ Registered on Karma with complete project info
✅ Tweet posted with @Celo @CeloDevs tags
✅ Tweet includes:
    ✅ Karma project link
    ✅ agentId (or screenshot explaining unavailability)
    ✅ Demo video link
    ✅ GitHub link
    ✅ Live website link
✅ Joined Telegram group
✅ Posted introduction in Telegram
✅ Code on GitHub with good README

QUALITY:
✅ Demo video is clear and < 3 minutes
✅ Website works on mobile
✅ Screenshots look professional
✅ README explains how to run the project
✅ All links work when clicked

VERIFICATION:
✅ 8004scan.io shows my agent
✅ Self Protocol verification attempted
    (agentId obtained OR screenshot of unavailability)
```

If everything is checked ✅, you're done!

---

## STEP 19: SUBMIT BEFORE DEADLINE

### Deadline: February 18, 2026 - 9 AM GMT

### Final steps:

**19.1** Check what time 9 AM GMT is in your timezone
- For Nigeria (WAT): 9 AM GMT = 10 AM WAT
- Use: https://www.timeanddate.com/worldclock/converter.html

**19.2** Submit at least 2 hours before deadline (in case of issues)

**19.3** After submitting, take screenshots of:
- Your tweet
- Your Karma submission
- Confirmation of everything

**19.4** Back up your code:
- Download a ZIP of your GitHub repo
- Save on Google Drive or local backup

✅ **YOU'RE OFFICIALLY SUBMITTED!** 🎉

---

## STEP 20: WAIT FOR RESULTS

### What happens next:

**February 18, 9 AM GMT:** Submissions close

**February 18-19:** Judges review all projects

**February 20, 3 PM GMT:** Winners announced!

### While waiting:

- Monitor Telegram for announcements
- Engage with other hackers' projects
- If judges ask questions, respond quickly
- Keep your demo video and website online

---

## 🆘 TROUBLESHOOTING GUIDE

### Problem 1: "Contract deployment failed"
**Error:** Transaction failed or out of gas

**Solution:**
1. Check MetaMask is on Celo Alfajores network
2. Check you have CELO for gas (get more from faucet)
3. Try deploying again

---

### Problem 2: "Agent can't connect to contract"
**Error:** Agent starts but shows connection error

**Solution:**
1. Verify contract address in `.env` is correct
2. Check RPC URL is: `https://alfajores-forno.celo-testnet.org`
3. Verify your private key is correct in `.env`

---

### Problem 3: "Website won't connect to wallet"
**Error:** MetaMask doesn't connect

**Solution:**
1. Make sure MetaMask is on Celo Alfajores
2. Try refreshing the page
3. Click "Connect Wallet" again

---

### Problem 4: "LLM code has errors"
**Error:** Code won't run, shows errors

**Solution:**
1. Copy the exact error message
2. Go back to ChatGPT/Claude
3. Paste: "I got this error: [paste error]. How do I fix it?"
4. LLM will give you the fix

---

### Problem 5: "Running out of time!"
**Error:** It's Feb 17 evening and you're not done

**Solution - Priority Mode:**
1. ✅ MUST HAVE: Contract deployed + basic agent + tweet
2. ❌ SKIP: Fancy UI, WhatsApp bot, perfect credit algorithm
3. ✅ DO THIS: Screen recording of even a simple payment working
4. ✅ SUBMIT: Even if not perfect, submit what you have!

Judges value "working demo" over "perfect but incomplete"

---

## 🎯 SUCCESS METRICS

You'll know you're successful when:

✅ You can send cUSD to your agent's wallet
✅ Transaction appears on blockchain explorer
✅ Your website shows the transaction
✅ Agent logs show it detected the payment
✅ Demo video shows all this working
✅ Tweet is posted with all required tags
✅ Karma submission is complete

**That's it - you've built a real AI agent!** 🎉

---

## 💰 AFTER WINNING (Feb 20+)

If you win:

**Prize payout:**
- Celo team will contact you via Twitter DM or Telegram
- You'll provide wallet address for USDT payment
- Prize arrives in ~1 week

**Next steps:**
- Share your win on Twitter
- Consider actually deploying to mainnet
- Pilot with real vendors in Lagos
- Apply for Celo grants to continue building

---

## 📞 NEED HELP?

### During the build:

1. **For code errors:** Ask the LLM that wrote the code
2. **For deployment issues:** Ask in Telegram group
3. **For hackathon rules:** Check the FAQ or ask in Telegram
4. **For stuck situations:** DM me your error and I'll help!

### Emergency contacts:

- Telegram: https://t.me/realworldagentshackathon
- Celo Docs: https://docs.celo.org
- Your LLM: ChatGPT/Claude (paste error messages!)

---

## 🏁 FINAL WORDS

**You have everything you need:**
- ✅ Strategy document (refined positioning)
- ✅ This step-by-step walkthrough
- ✅ LLM to write all the code
- ✅ Free testnet to deploy
- ✅ 2 days until deadline

**Remember:**
- Start simple, iterate
- Working demo > perfect code
- LLM is your coding partner
- Testnet = $0 cost
- You can do this!

**Timeline:**
- Today: Steps 1-9 (build & deploy)
- Tomorrow: Steps 10-18 (demo & submit)
- Feb 20: Win $4,000! 💰

**NOW GO BUILD!** 🚀

---

## YOUR JOURNEY RECAP

```
TODAY (Feb 16):
⏰ 15 min → Set up wallet
⏰ 10 min → Get free test money  
⏰ 30 min → LLM writes contracts
⏰ 20 min → Deploy contracts
⏰ 45 min → LLM writes agent
⏰ 30 min → Run agent
⏰ 30 min → LLM writes website
⏰ 20 min → Deploy website
⏰ 1 hour → Test everything
━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ~4 hours

TOMORROW (Feb 17):
⏰ 15 min → Self Protocol attempt
⏰ 1.5 hours → Record demo video
⏰ 30 min → Create Karma project
⏰ 20 min → Upload to GitHub
⏰ 20 min → Craft tweet
⏰ 30 min → Final checklist
━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ~3.5 hours

FEB 18:
⏰ Submit before 9 AM GMT (10 AM Lagos time)

FEB 20:
🎉 Winners announced - that's YOU!
```

Good luck! You've got this! 💪🚀