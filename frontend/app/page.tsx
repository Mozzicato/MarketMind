"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  CreditCard,
  Award,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  Play,
  CheckCircle2,
  Mic,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ethers } from 'ethers';
import {
  NEXT_PUBLIC_CELO_RPC_URL,
  NEXT_PUBLIC_MARKETMIND_AGENT_ADDRESS,
  AGENT_ABI
} from '@/lib/contracts';

const MOCK_REVENUE_DATA = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 300 },
  { name: 'Wed', revenue: 900 },
  { name: 'Thu', revenue: 200 },
  { name: 'Fri', revenue: 800 },
  { name: 'Sat', revenue: 1200 },
  { name: 'Sun', revenue: 1100 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    creditScore: 300,
    totalRevenue: "0",
    balance: "0",
    profitMargin: 0,
    txCount: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi! I've been monitoring the market trends. Your revenue is peaking, which is fantastic.", type: 'agent' },
    { text: "I noticed we're a bit low on tomatoes. Should I prepare a payment of 20 cUSD for your preferred supplier?", type: 'action' }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_CELO_RPC_URL);
        const agent = new ethers.Contract(NEXT_PUBLIC_MARKETMIND_AGENT_ADDRESS, AGENT_ABI, provider);

        const [score, rev, bal, margin, count] = await Promise.all([
          agent.creditScore().catch(() => BigInt(300)),
          agent.totalRevenue().catch(() => BigInt(0)),
          agent.getBalance().catch(() => BigInt(0)),
          agent.getProfitMargin().catch(() => BigInt(0)),
          agent.transactionCount().catch(() => BigInt(0))
        ]);

        setStats({
          creditScore: Number(score),
          totalRevenue: ethers.formatEther(rev),
          balance: ethers.formatEther(bal),
          profitMargin: Number(margin),
          txCount: Number(count)
        });
      } catch (e) {
        console.error("Fetch error", e);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateVoice = () => {
    if (!inputText) return;
    setIsSimulating(true);

    // Mocking the agent response sequence
    setChatMessages(prev => [...prev, { text: inputText, type: 'user' }]);
    setInputText('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "Understood! I'm verifying that transaction on the Celo blockchain now. Your credit score will update shortly.",
        type: 'agent'
      }]);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <main className="pb-12 bg-[#05070a] text-foreground min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-white-5 bg-black-50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="gradient-text text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={28} className="text-primary" />
            MarketMind
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary-20 rounded-full border border-primary-20">
            <CheckCircle2 size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Identity Verified by Self Protocol</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end px-4 border-r border-white-10">
            <span className="text-xs text-muted font-bold uppercase">Status</span>
            <span className="text-success text-sm font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Connected
            </span>
          </div>
          <button className="btn-primary">Connect Wallet</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-2">Welcome back, Vendor! 👋</h2>
            <p className="text-muted text-lg">Your autonomous agent is monitoring the market and protecting your capital.</p>
          </motion.div>

          <div className="flex gap-3">
            <div className="glass-card py-2 px-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white-5 flex items-center justify-center">
                <ShieldCheck size={18} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase font-bold">Agent Mode</div>
                <div className="text-xs font-bold text-success">Autonomous (Active)</div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Metrics Grid */}
        <div className="dashboard-grid mb-12">
          <MetricCard
            title="Credit Reputation"
            value={stats.creditScore}
            subtitle="Calculated onchain weekly"
            icon={<Award className="text-primary" />}
            progress={((stats.creditScore - 300) / 550) * 100}
            color="var(--primary)"
          />
          <MetricCard
            title="Total Revenue"
            value={`${stats.totalRevenue} cUSD`}
            subtitle="Verified Sales history"
            icon={<TrendingUp className="text-secondary" />}
          />
          <MetricCard
            title="Business Balance"
            value={`${stats.balance} cUSD`}
            subtitle="Capital in Agent Wallet"
            icon={<ShieldCheck className="text-success" />}
          />
          <MetricCard
            title="Efficiency Score"
            value={`${stats.profitMargin}%`}
            subtitle="Net Profit Margin"
            icon={<Package className="text-accent" />}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg-grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg-col-span-2 flex flex-col gap-8">
            <div className="glass-card overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold">Performance Analytics</h3>
                  <p className="text-xs text-muted">Real-time revenue tracking across all inventory items</p>
                </div>
                <div className="flex bg-white-5 p-1 rounded-lg">
                  <button className="px-4 py-1.5 text-xs font-bold bg-primary text-black rounded-md shadow-lg shadow-primary-20 transition-all">Revenue</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-muted hover:text-white transition-colors">Costs</button>
                </div>
              </div>

              <div className="h-350">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benevolent Finance Section */}
            <section className="glass-card bg-accent-5 border border-accent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <CreditCard size={120} className="text-accent" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                  <div className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Social Impact Fund</div>
                  <h3 className="text-2xl font-bold mb-2">Transparent Business Capital</h3>
                  <p className="text-muted max-lg italic">"I've analyzed your performance. You qualify for an interest-free expansion loan to grow your business."</p>
                </div>
                <div className="flex gap-6 px-8 py-4 bg-black-50 rounded-2xl border border-white-10">
                  <div className="text-center">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Limit</div>
                    <div className="text-xl font-bold">500 cUSD</div>
                  </div>
                  <div className="w-px h-10 bg-white-10" />
                  <div className="text-center">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Interest</div>
                    <div className="text-xl font-bold text-accent">0%</div>
                  </div>
                </div>
                <button className="btn-primary px-8 h-14 bg-accent hover:shadow-accent text-white rounded-xl font-bold">Access Capital</button>
              </div>
            </section>
          </div>

          {/* AI Agent Interaction Section */}
          <div className="flex flex-col gap-6">
            <div className="glass-card flex flex-col flex-1 h-full max-h-[600px] border-white-10">
              <div className="flex items-center justify-between mb-6 border-b border-white-10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-20 flex items-center justify-center border border-primary-20">
                    <MessageSquare className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">MarketMind Agent</h3>
                    <div className="text-[10px] text-success font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-success rounded-full" />
                      Online
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white-5 rounded-lg transition-colors">
                  <HelpCircle size={18} className="text-muted" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6 pr-2 scrollbar-style custom-scrollbar">
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.type === 'user' ? (
                        <div className="bg-primary text-black px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium max-w-[80%] shadow-lg shadow-primary-20">
                          {msg.text}
                        </div>
                      ) : (
                        <AgentBubble text={msg.text} type={msg.type === 'action' ? 'action' : 'text'} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isSimulating && (
                  <div className="flex justify-start">
                    <div className="bg-white-5 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="animate-spin text-primary" size={14} />
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Agent is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input / Simulation Box */}
              <div className="mt-auto pt-4 border-t border-white-10">
                <div className="text-[10px] text-muted font-bold uppercase mb-3 px-1">Voice Logging Simulator</div>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-white-5 border border-white-10 rounded-xl px-4 py-3 group focus-within:border-primary-20 transition-all shadow-inner">
                    <Mic
                      size={18}
                      className={`${isSimulating ? 'text-danger animate-pulse' : 'text-muted group-focus-within:text-primary'} transition-colors cursor-pointer mr-3`}
                    />
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSimulateVoice()}
                      placeholder="'I sold 5 onions for 200 naira'..."
                      className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-muted"
                    />
                  </div>
                  <button
                    onClick={handleSimulateVoice}
                    disabled={isSimulating || !inputText}
                    className="p-3 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setInputText('I just sold 10 tomatoes for 500 naira')}
                    className="flex-1 py-2 bg-white-10 hover:bg-white-20 rounded-lg text-[10px] font-bold uppercase transition-colors text-slate-300"
                  >
                    Quick Sale
                  </button>
                  <button
                    onClick={() => setInputText('Agent, I need to pay the supplier for more onions')}
                    className="flex-1 py-2 bg-white-10 hover:bg-white-20 rounded-lg text-[10px] font-bold uppercase transition-colors text-slate-300"
                  >
                    Quick Restock
                  </button>
                </div>
              </div>
            </div>

            {/* Reputation Progress Bar */}
            <div className="glass-card border-white-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase text-muted">Next Tier Progress</h4>
                <div className="text-xs font-bold text-primary">78%</div>
              </div>
              <div className="w-full h-2 bg-white-5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[10px] text-muted italic">Complete 5 more verified sales to unlock higher financing limits.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </main>
  );
}

function MetricCard({ title, value, subtitle, icon, progress, color }: any) {
  return (
    <div className="glass-card relative overflow-hidden group border-white-5">
      <div className="absolute top-0 right-0 m-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {React.cloneElement(icon, { size: 60 })}
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white-5 p-3 rounded-xl border border-white-10 group-hover:border-primary-20 transition-colors">
          {icon}
        </div>
        <div className="p-1 hover:bg-white-10 rounded-full transition-colors cursor-pointer">
          <HelpCircle size={14} className="text-muted" />
        </div>
      </div>
      <div className="text-xs text-muted font-bold uppercase tracking-tight mb-1">{title}</div>
      <div className="text-3xl font-bold mb-2 tracking-tighter group-hover:text-primary transition-colors">{value}</div>
      <div className="text-[10px] text-muted font-medium mb-4">{subtitle}</div>

      {progress !== undefined && (
        <div className="w-full h-1 bg-white-5 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,242,254,0.5)]"
            style={{ backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}

function AgentBubble({ text, type = 'text', success }: { text: string, type?: 'text' | 'action', success?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl rounded-tl-none border shadow-lg ${type === 'action'
      ? 'bg-primary-20 border-primary-20'
      : success
        ? 'bg-accent-5 border-accent-20'
        : 'bg-white-5 border-white-10'
      }`}>
      <div className="text-xs text-slate-300 leading-relaxed font-medium">
        {success && <CheckCircle2 size={12} className="inline mr-2 text-accent" />}
        {text}
      </div>
      {type === 'action' && (
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1.5 bg-primary text-black text-[10px] font-bold rounded-lg uppercase hover:scale-105 transition-transform">Approve Payment</button>
          <button className="px-3 py-1.5 bg-white-10 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-white-20 transition-colors">Ignore</button>
        </div>
      )}
    </div>
  );
}
