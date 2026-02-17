# MarketMind - Practical Build Guide
## How to Actually Build This (With LLM Help + Zero/Low Cost)

---

## 🤖 WHAT AN LLM CAN BUILD FOR YOU

### ✅ What LLMs Can Do Well
1. **Write smart contracts** - Give it the specs, it writes Solidity code
2. **Create agent logic** - Build Eliza actions and decision-making code
3. **Build basic UI** - Simple web interfaces, WhatsApp bot logic
4. **Write documentation** - READMEs, setup guides, API docs
5. **Debug code** - Help fix errors and optimize
6. **Create test scripts** - Automated testing for your contracts

### ❌ What LLMs Can't Do (You Need to Do)
1. **Deploy to blockchain** - You must run deployment commands
2. **Set up accounts** - Create wallets, get API keys
3. **Test with real users** - Actually try the product
4. **Record demo video** - Film the working product
5. **Submit to hackathon** - Tweet, register on Karma
6. **Make decisions** - Choose between options (WhatsApp vs web, etc.)

---

## 💰 COST BREAKDOWN (Spoiler: Almost Free!)

### Free Options (Recommended for Hackathon)
✅ **Celo Alfajores Testnet** - FREE
- Test CELO for gas fees (free from faucet)
- Test cUSD (free from faucet)
- Perfect for hackathon demo
- **Cost: $0**

✅ **GitHub** - FREE
- Host your code
- **Cost: $0**

✅ **Vercel/Netlify** - FREE tier
- Host web interface
- **Cost: $0**

✅ **Replit** - FREE tier
- Code online, deploy from browser
- **Cost: $0**

### Paid Options (Optional)
⚠️ **Celo Mainnet** - COSTS REAL MONEY
- Need real CELO for gas (~$0.001 per transaction)
- Initial deployment: ~$0.10-0.50
- **Only use if you want production deployment**
- **For hackathon: TESTNET IS ENOUGH!**

⚠️ **OpenAI API** (for agent)
- GPT-4 costs ~$0.03 per 1k tokens
- Daily usage: ~$0.50-2.00
- **Alternative: Use Claude API (you have access to Claude)**
- **Or use local LLMs (Ollama) - FREE**

---

## 🎯 RECOMMENDATION: USE TESTNET FOR HACKATHON

**Why testnet is perfect:**
1. ✅ Judges accept testnet deployments
2. ✅ Everything works exactly like mainnet
3. ✅ Completely free
4. ✅ No risk of losing money
5. ✅ Can still win $4,000 prize!

**The FAQ doesn't require mainnet** - it just says "deploy your agent"

---

## 📋 COMPLETE BUILD CHECKLIST

### Phase 1: Setup (30 minutes)

#### Step 1: Get a Wallet
```bash
# Option A: MetaMask (easiest)
1. Install MetaMask browser extension
2. Create new wallet
3. SAVE YOUR SEED PHRASE! (12 words - write it down!)
4. Copy your wallet address (starts with 0x...)

# Option B: CLI wallet (for advanced users)
npm install -g @celo/celocli
celocli account:new
```

#### Step 2: Add Celo Alfajores Testnet to MetaMask
```
Network Name: Celo Alfajores Testnet
RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol: CELO
Block Explorer: https://alfajores.celoscan.io
```

#### Step 3: Get Free Test Tokens
```
1. Go to: https://faucet.celo.org/alfajores
2. Paste your wallet address
3. Click "Get CELO" and "Get cUSD"
4. Wait 30 seconds
5. Check MetaMask - you should have ~5 CELO and ~10 cUSD (FREE!)
```

#### Step 4: Set Up Development Environment
```bash
# Option A: Online (Replit - easiest, no install needed)
1. Go to replit.com
2. Create new Repl
3. Choose "Node.js" template
4. Start coding!

# Option B: Local (if you prefer)
1. Install Node.js: https://nodejs.org
2. Install VS Code: https://code.visualstudio.com
3. Create folder: mkdir marketmind && cd marketmind
4. Initialize: npm init -y
```

---

## 🤖 HOW TO USE LLM TO BUILD

### Step-by-Step LLM Workflow

#### Round 1: Smart Contracts
**Prompt to LLM:**
```
I'm building MarketMind for the Celo hackathon. I need you to write Solidity smart contracts based on this spec:

[Paste the Smart Contract Architecture section from the strategy doc]

Requirements:
- Use Solidity 0.8.20
- Deploy on Celo (EVM-compatible)
- Follow ERC-8004 standard for agent wallet
- Include comments explaining each function
- Make it secure (prevent reentrancy, overflow)

Please write:
1. MarketMindAgent.sol (main agent wallet)
2. CreditScoring.sol (credit score calculation)
3. MicroLending.sol (loan eligibility)

Also provide a deployment script using Hardhat.
```

**What you'll get:**
- 3 Solidity files
- Deployment script
- Setup instructions

**What you do next:**
1. Copy code into files
2. Run `npm install --save-dev hardhat`
3. Follow LLM's deployment instructions
4. Deploy to Alfajores testnet

---

#### Round 2: Agent Logic (Eliza Framework)
**Prompt to LLM:**
```
Now I need the AI agent logic using Eliza framework. Based on this spec:

[Paste the Agent Logic section from strategy doc]

Requirements:
- Use Eliza framework (https://github.com/ai16z/eliza)
- Connect to the smart contracts deployed at: [YOUR_CONTRACT_ADDRESS]
- Implement these actions:
  1. acceptPaymentAction - listen for incoming cUSD, record onchain
  2. paySuppliersAction - monitor inventory, pay suppliers
  3. creditScoringAction - update credit score daily
  4. optimizationAction - analyze sales, give recommendations

- Use Anthropic Claude API (I have access)
- Include error handling
- Add logging for debugging

Provide:
1. Complete Eliza agent setup
2. All action files
3. Configuration for Celo testnet
4. Instructions to run locally
```

**What you'll get:**
- Eliza project structure
- Action implementations
- Config files
- Run instructions

**What you do next:**
1. Copy code into your project
2. Add your Claude API key to `.env` file
3. Run `npm install`
4. Start agent: `npm start`

---

#### Round 3: Mobile Interface
**Prompt to LLM:**
```
I need a simple web interface for vendors to interact with their MarketMind agent.

Requirements:
- Mobile-first design (works on phones)
- Shows: wallet balance, credit score, recent transactions, inventory
- Actions: 
  - Generate QR code for receiving payments
  - Approve/reject agent decisions
  - View transaction history
- Connect to MetaMask wallet
- Call smart contract at: [YOUR_CONTRACT_ADDRESS]
- Use React + Tailwind CSS
- Deploy on Vercel (free)

Please provide:
1. Complete React app
2. Smart contract integration
3. QR code generation for payments
4. Mobile-responsive UI
5. Deployment instructions for Vercel
```

**What you'll get:**
- React app code
- UI components
- Web3 integration
- Deployment guide

**What you do next:**
1. Copy code into new folder
2. Run `npm install`
3. Test locally: `npm run dev`
4. Deploy to Vercel: `vercel deploy` (free)

---

#### Round 4: WhatsApp Bot (Optional, More Advanced)
**Prompt to LLM:**
```
I want to add a WhatsApp interface using Twilio.

Features:
- Vendor sends "Balance" → Agent replies with cUSD balance
- Vendor sends "Sales today" → Agent shows daily revenue
- Vendor sends "Approve payment to Bala" → Agent executes supplier payment
- Agent proactively messages when:
  - Payment received
  - Stock low
  - Credit score updated

Use:
- Twilio API for WhatsApp
- Connect to Eliza agent
- Free Twilio trial account

Provide complete code + setup guide.
```

**What you'll get:**
- WhatsApp bot code
- Twilio setup instructions

**What you do next:**
1. Sign up for Twilio (free trial)
2. Follow setup guide
3. Connect to your agent

---

## 📦 COMPLETE PROMPT PACKAGE FOR LLM

Here's everything to give your LLM in ONE shot:

```markdown
# PROJECT BRIEF

I'm building MarketMind for Celo's Real World Agents Hackathon (deadline: Feb 18, 2026).

## What It Is
An AI agent that helps informal market vendors accept stablecoin payments, track revenue, 
and build credit scores onchain. The agent holds an ERC-8004 wallet, receives payments, 
pays suppliers autonomously, and calculates creditworthiness.

## Technical Requirements
- Deploy on Celo Alfajores Testnet (free)
- Smart contracts in Solidity 0.8.20
- AI agent using Eliza framework
- Mobile web interface (React + Tailwind)
- Use Claude API for agent intelligence
- Must work on phones (most users in Nigeria)

## Components Needed

### 1. Smart Contracts
File: contracts/MarketMindAgent.sol
- ERC-8004 compliant agent wallet
- Functions: acceptPayment(), paySupplier(), recordSale(), updateCreditScore()
- Store: transactions, inventory, credit metrics

File: contracts/CreditScoring.sol
- Calculate credit score (300-850 range) based on:
  - Transaction frequency (30% weight)
  - Payment reliability (25% weight)
  - Revenue consistency (20% weight)
  - Profit margin (15% weight)
  - Account age (10% weight)

File: contracts/MicroLending.sol
- Check loan eligibility based on credit score
- Loan terms: max amount, interest rate, duration
- Auto-repayment from agent wallet

### 2. AI Agent (Eliza Framework)
Location: agent/src/

Actions needed:
- acceptPaymentAction.ts - Listen for incoming cUSD transfers, update inventory
- paySuppliersAction.ts - Monitor stock levels, request approval, execute payments
- creditScoringAction.ts - Calculate and update credit score daily
- optimizationAction.ts - Analyze sales patterns, recommend reordering

Decision logic:
- Restock when: (current_stock / avg_daily_sales) < 2 days
- Reorder quantity: avg_daily_sales * 7 (one week supply)
- Only order if: cost <= 70% of current balance

### 3. Web Interface
Location: web/

Pages needed:
- Dashboard: Show balance, credit score, today's sales
- Transactions: List of all payments in/out
- Inventory: Current stock levels with alerts
- QR Code: Generate code for customers to scan and pay
- Approvals: Pending agent actions needing vendor approval

Tech stack:
- React 18
- Tailwind CSS
- Wagmi for Web3 (connect to Celo)
- QR code library
- Mobile-first responsive design

### 4. Deployment Scripts
- Hardhat deployment for smart contracts
- Vercel config for web app
- Environment variables template (.env.example)
- Setup instructions (README.md)

## Constraints
- Must be simple enough for low-literacy users
- Work on low-end phones
- Handle poor connectivity (offline mode)
- Gas-efficient (Celo fees are low but still optimize)
- Secure (prevent common vulnerabilities)

## Deliverables
Please provide:
1. All smart contract code with comments
2. Complete Eliza agent setup
3. React web app
4. Deployment scripts
5. README with setup instructions
6. .env.example file
7. Testing guide

## Target Deployment
- Celo Alfajores Testnet (NOT mainnet - want to avoid costs)
- Vercel (free tier) for web hosting
- Local or cloud for agent runtime

Please structure the code professionally with:
- Clear folder organization
- Comments explaining key logic
- Error handling
- Logging for debugging
- Security best practices

Ask me clarifying questions if anything is unclear!
```

---

## 🛠️ WHAT YOU PROVIDE TO LLM

### Required Info

#### 1. Your Wallet Address
```
After creating MetaMask wallet, tell LLM:
"My wallet address is: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
```

#### 2. Contract Addresses (After Deployment)
```
After deploying contracts, tell LLM:
"I deployed the contracts to:
- MarketMindAgent: 0xABC123...
- CreditScoring: 0xDEF456...
- MicroLending: 0xGHI789...

Now build the agent to interact with these addresses."
```

#### 3. API Keys
```
Create .env file with:
ANTHROPIC_API_KEY=sk-ant-... (your Claude API key)
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
PRIVATE_KEY=your_wallet_private_key (NEVER share this publicly!)
CONTRACT_ADDRESS=0xABC123... (your deployed contract)
```

#### 4. Preferences
```
Tell LLM:
"I prefer:
- TypeScript over JavaScript (safer)
- Detailed comments in code (I'm learning)
- Step-by-step deployment instructions
- Test scripts to verify everything works"
```

---

## 🚀 DEPLOYMENT WALKTHROUGH (Step-by-Step)

### Step 1: Deploy Smart Contracts

```bash
# In your project folder

# 1. Install dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# 2. Initialize Hardhat
npx hardhat

# 3. Create hardhat.config.js
# (LLM will provide this - it configures Celo Alfajores)

# 4. Put contract code in contracts/ folder
# (LLM gives you MarketMindAgent.sol, etc.)

# 5. Create deployment script
# File: scripts/deploy.js
# (LLM provides this)

# 6. Deploy to testnet
npx hardhat run scripts/deploy.js --network alfajores

# 7. Save the contract addresses that print out!
# Example output:
# MarketMindAgent deployed to: 0xABC123...
# CreditScoring deployed to: 0xDEF456...
```

**Cost: $0** (using free testnet tokens)

---

### Step 2: Set Up Agent

```bash
# 1. Clone Eliza framework
git clone https://github.com/ai16z/eliza
cd eliza

# 2. Install dependencies
npm install

# 3. Add your actions
# (Copy action files from LLM into src/actions/)

# 4. Configure .env
ANTHROPIC_API_KEY=your_key_here
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
AGENT_WALLET_PRIVATE_KEY=your_private_key
MARKETMIND_CONTRACT=0xABC123... (your deployed contract address)

# 5. Start the agent
npm start

# You should see:
# ✅ Agent connected to Celo Alfajores
# ✅ Monitoring contract at 0xABC123...
# ✅ Ready to accept payments
```

**Cost: $0** (if using Claude API from your existing account)

---

### Step 3: Deploy Web Interface

```bash
# 1. Create React app
npx create-react-app marketmind-web
cd marketmind-web

# 2. Install dependencies
npm install wagmi viem @tanstack/react-query qrcode.react

# 3. Copy UI code from LLM
# (LLM provides all React components)

# 4. Test locally
npm start
# Opens http://localhost:3000

# 5. Deploy to Vercel (FREE!)
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, get URL like: marketmind-web.vercel.app
```

**Cost: $0** (Vercel free tier)

---

### Step 4: Test End-to-End

```bash
# 1. Open your web app (localhost or Vercel URL)

# 2. Connect MetaMask wallet

# 3. Send test payment to agent:
# - Copy agent's QR code
# - Scan with another MetaMask wallet
# - Send 1 cUSD
# - Should see transaction in dashboard!

# 4. Check agent logs:
# Should print:
# ✅ Payment received: 1 cUSD from 0xDEF...
# ✅ Transaction recorded onchain
# ✅ Credit score updated: 650 → 655

# 5. Test supplier payment:
# - Agent should detect low inventory
# - Request approval in UI
# - You approve
# - Agent sends cUSD to supplier address
```

**Cost: $0** (all testnet transactions)

---

## 🎬 RECORDING DEMO VIDEO

### Equipment Needed
- Phone camera OR screen recording software (free)
- Script (provided below)

### Demo Video Script (3 minutes)

```
[Scene 1 - The Problem] (0:00-0:30)
- Show Lagos street market (stock footage or photo)
- Voiceover: "Meet Amina. She sells tomatoes in Lagos..."
- Text overlay: "2 billion people in informal economy"
- "No bank account. No credit history. No access to capital."

[Scene 2 - The Solution] (0:30-1:00)
- Show your web app
- "This is MarketMind - her AI business agent"
- Highlight agent wallet address
- "It has its own wallet, holds cUSD, and makes decisions"

[Scene 3 - Live Demo] (1:00-2:15)
📱 SCREEN RECORDING:

1. Customer Payment (0:30)
   - Show QR code on screen
   - Scan with second phone/wallet
   - Send 2 cUSD
   - Show transaction appear in dashboard
   - Agent notification: "Payment received!"

2. Credit Score Update (0:15)
   - Dashboard shows: Credit Score: 655 (+5)
   - Transaction count: 23
   - On-time payments: 100%

3. Supplier Payment (0:30)
   - Agent alert: "Low on tomatoes. Order from supplier?"
   - Show approval button
   - Click approve
   - Transaction executes onchain
   - Show on Celoscan explorer

4. Loan Eligibility (0:30)
   - Dashboard shows: "✅ Eligible for 100 cUSD loan"
   - Credit score: 750
   - Terms: 8% APR, 90 days

[Scene 4 - Impact] (2:15-2:45)
- Show stats:
  - "23 transactions processed"
  - "100% payment reliability"
  - "Credit score: 750"
  - "Loan eligible: 100 cUSD"
- Text: "From invisible to creditworthy in 2 weeks"

[Scene 5 - Call to Action] (2:45-3:00)
- Show agent on 8004scan.io
- "MarketMind: Financial identity for the informal economy"
- Your Twitter handle
- "Built on Celo for the Real World"
```

### Recording Tips
1. **Screen recording** (easiest): Use OBS Studio (free) or QuickTime (Mac)
2. **Phone recording**: Mount phone, record screen with another device
3. **Voiceover**: Use your phone's voice recorder, add in video editor
4. **Editing**: Use DaVinci Resolve (free) or iMovie (Mac)
5. **Music**: Use royalty-free music from YouTube Audio Library

**Cost: $0** (all free tools)

---

## 📊 REALISTIC TIMELINE

### If Starting Today (Feb 16)

**You have 2 days until deadline (Feb 18, 9 AM GMT)**

⚡ **SPEED RUN MODE** ⚡

#### Day 1 (Today - Feb 16)
**Morning (3 hours):**
- ✅ Set up MetaMask wallet (15 min)
- ✅ Get testnet tokens (10 min)
- ✅ Give LLM the complete prompt (30 min)
- ✅ LLM writes smart contracts (30 min)
- ✅ Deploy contracts to Alfajores (30 min)
- ✅ LLM writes agent code (45 min)

**Afternoon (3 hours):**
- ✅ Set up Eliza agent locally (1 hour)
- ✅ Test agent with contract (1 hour)
- ✅ LLM writes web interface (1 hour)

**Evening (3 hours):**
- ✅ Deploy web app to Vercel (30 min)
- ✅ End-to-end testing (1.5 hours)
- ✅ Fix bugs (1 hour)

#### Day 2 (Tomorrow - Feb 17)
**Morning (3 hours):**
- ✅ Self Protocol verification OR screenshot (30 min)
- ✅ Register on 8004scan.io (15 min)
- ✅ Record demo video (1.5 hours)
- ✅ Edit video (45 min)

**Afternoon (3 hours):**
- ✅ Write Karma project description (45 min)
- ✅ Take screenshots (30 min)
- ✅ Write README documentation (45 min)
- ✅ Craft submission tweet (30 min)
- ✅ Buffer for issues (30 min)

**Evening (2 hours):**
- ✅ Submit to Karma (30 min)
- ✅ Post tweet (15 min)
- ✅ Share in Telegram group (15 min)
- ✅ Final checks (1 hour)

**TOTAL: ~14 hours of work over 2 days**

**THIS IS DOABLE!** 💪

---

## ⚠️ COMMON PITFALLS & SOLUTIONS

### Pitfall 1: "Contract deployment failed"
**Cause:** Not enough testnet CELO for gas  
**Solution:** Get more from faucet.celo.org

### Pitfall 2: "Agent can't connect to contract"
**Cause:** Wrong contract address in .env  
**Solution:** Double-check address from deployment logs

### Pitfall 3: "Web app won't connect to wallet"
**Cause:** MetaMask on wrong network  
**Solution:** Switch to Celo Alfajores in MetaMask

### Pitfall 4: "LLM code has bugs"
**Cause:** LLM made assumptions or used outdated libraries  
**Solution:** Copy error message, ask LLM to fix it

### Pitfall 5: "Self Protocol not available in Nigeria"
**Cause:** Not launched there yet  
**Solution:** Take screenshot of error message, submit anyway (FAQ says this is OK!)

### Pitfall 6: "Running out of time"
**Cause:** Perfectionism  
**Solution:** MVP is enough! Working demo > polished but broken

---

## 🎯 MINIMUM VIABLE SUBMISSION

If time is tight, **this is enough to win:**

✅ **Smart contract deployed** to Alfajores (even if simple)  
✅ **Agent can receive 1 payment** and record it onchain  
✅ **Basic web UI** showing balance and transactions  
✅ **1-minute demo video** of payment flow working  
✅ **Karma page** with description and links  
✅ **Tweet** with required tags  

**You DON'T need:**
❌ Fancy UI design  
❌ WhatsApp integration  
❌ Full loan system  
❌ 100 features  

**Judges care about:**
1. ✅ Does it work end-to-end?
2. ✅ Is it autonomous (agent makes decisions)?
3. ✅ Does it solve a real problem?
4. ✅ Is code clean and documented?

---

## 💡 EMERGENCY SHORTCUTS

### If You're REALLY Out of Time

#### Option A: Fork Existing Eliza Agent
```bash
# Start with working Eliza agent
git clone https://github.com/ai16z/eliza
cd eliza

# Modify for Celo:
# 1. Change RPC URL to Celo Alfajores
# 2. Add credit scoring logic to existing trading logic
# 3. Point at your deployed contract
# 4. Done!
```

#### Option B: Use Remix IDE (No Local Setup)
```
1. Go to remix.ethereum.org
2. Paste contract code from LLM
3. Compile in browser
4. Deploy to Celo Alfajores (connect MetaMask)
5. Copy contract address
6. Build frontend that just calls this contract
```

#### Option C: Simplify Scope
```
Version 1.0 (for hackathon):
✅ Accept payments
✅ Track transactions onchain
✅ Calculate simple credit score
❌ Skip supplier payments (manual for now)
❌ Skip loan system (show eligibility only)
❌ Skip WhatsApp (web only)

Still wins! Proves the concept.
```

---

## 🏆 FINAL CHECKLIST

### Technical
- [ ] Wallet created, testnet tokens obtained
- [ ] Smart contracts written (by LLM)
- [ ] Contracts deployed to Alfajores
- [ ] Contract addresses saved
- [ ] Agent code written (by LLM)
- [ ] Agent running and connected to contract
- [ ] Web UI deployed to Vercel
- [ ] Can accept payment end-to-end

### Submission
- [ ] Self Protocol verification (or screenshot)
- [ ] Registered on 8004scan.io
- [ ] Demo video recorded and uploaded
- [ ] Karma project page complete
- [ ] Tweet drafted with all tags
- [ ] Screenshots ready

### Quality
- [ ] Code on GitHub
- [ ] README explains setup
- [ ] Demo video shows working product
- [ ] Clear value proposition in submission

---

## 🚀 YOU CAN DO THIS!

**Remember:**
- LLM writes the code ✅
- Testnet is FREE ✅
- You have the strategy doc ✅
- Deadline is 2 days away ✅
- Prize is $4,000 ✅

**Next steps:**
1. Set up wallet (15 min)
2. Give LLM the complete prompt above
3. Follow the deployment walkthrough
4. Record quick demo
5. Submit!

**Questions before you start building?** Ask me and I'll help troubleshoot! 💪

---

## 📞 GETTING HELP

### When Stuck
1. **Copy error message** → paste to LLM → ask for fix
2. **Check Celo docs**: docs.celo.org
3. **Ask in Telegram**: t.me/realworldagentshackathon
4. **Search GitHub**: Look for similar Eliza agents on Celo

### LLM Troubleshooting Prompt
```
I'm getting this error:
[paste error]

My setup:
- Celo Alfajores testnet
- Contract address: 0x...
- Using Hardhat/Eliza/React
- Node version: v18

What's wrong and how do I fix it?
```

**Good luck! Now go build and win! 🏆**