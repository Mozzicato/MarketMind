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
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_CELO_RPC_URL);
        const agent = new ethers.Contract(NEXT_PUBLIC_MARKETMIND_AGENT_ADDRESS, AGENT_ABI, provider);

        const [score, rev, bal, margin, count] = await Promise.all([
          agent.creditScore().catch(() => 300n),
          agent.totalRevenue().catch(() => 0n),
          agent.getBalance().catch(() => 0n),
          agent.getProfitMargin().catch(() => 0n),
          agent.transactionCount().catch(() => 0n)
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
  }, []);

  return (
    <main className="pb-12">
      <nav className="p-6 flex justify-between items-center border-b bg-black-50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="gradient-text text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={28} className="text-primary" />
            MarketMind
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end px-4">
            <span className="text-xs text-muted uppercase font-bold">Network</span>
            <span className="text-success text-sm font-bold flex items-center gap-2">
              Celo Sepolia
            </span>
          </div>
          <button className="btn-primary">Connect Wallet</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-bold mb-2">As-salamu Alaykum, Vendor! 👋</h2>
          <p className="text-muted text-lg">Your business reputation is growing on the blockchain.</p>
        </motion.div>

        <div className="dashboard-grid mb-12">
          <MetricCard
            title="Credit Score"
            value={stats.creditScore}
            subtitle="Real-time Reputation"
            icon={<Award className="text-primary" />}
            progress={((stats.creditScore - 300) / 550) * 100}
            color="var(--primary)"
          />
          <MetricCard
            title="Total Revenue"
            value={`${stats.totalRevenue} cUSD`}
            subtitle="Accumulated Sales"
            icon={<TrendingUp className="text-secondary" />}
          />
          <MetricCard
            title="Wallet Balance"
            value={`${stats.balance} cUSD`}
            subtitle="Available Capital"
            icon={<ShieldCheck className="text-success" />}
          />
          <MetricCard
            title="Profit Margin"
            value={`${stats.profitMargin}%`}
            subtitle="Net efficiency"
            icon={<Package className="text-accent" />}
          />
        </div>

        <div className="grid grid-cols-1 lg-grid-cols-3 gap-8">
          <div className="lg-col-span-2 glass-card overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Sales Volume</h3>
              <span className="text-primary text-sm font-bold bg-primary-20 px-4 py-1 rounded-full">LIVE</span>
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
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
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

          <div className="glass-card flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-primary" size={24} />
              <h3 className="font-bold">Agent Insight</h3>
            </div>

            <div className="flex-1 mb-6">
              <div className="bg-white-5 p-4 rounded-xl text-sm text-slate-300 mb-4">
                "Salam! I noticed your revenue is peaking. You're eligible for a benevolent loan if you need to restock."
              </div>
              <div className="bg-accent-5 p-4 rounded-xl text-sm text-accent italic border border-accent">
                System: Benevolent Loan (Qard al-Hasan) active eligibility.
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Talk to MarketMind..."
                className="flex-1 bg-white-5 border border-white-10 rounded-xl px-4 py-3 text-sm text-white"
              />
              <button className="btn-primary p-3 rounded-xl flex items-center justify-center">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <section className="mt-12 glass-card bg-accent-5 border border-accent">
          <div className="flex flex-col md:flex-row items-center gap-8 p-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Benevolent Financing (Qard al-Hasan)</h3>
              <p className="text-muted">No interest, no riba. Purely to support your business expansion.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-muted">Limit</div>
                <div className="font-bold">500 cUSD</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted">Interest</div>
                <div className="font-bold text-accent">0%</div>
              </div>
            </div>
            <button className="btn-primary">Apply Now</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ title, value, subtitle, icon, progress, color }: any) {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white-5 p-3 rounded-xl">
          {icon}
        </div>
        <HelpCircle size={16} className="text-muted" />
      </div>
      <div className="text-sm text-muted mb-1">{title}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-xs text-muted mb-4">{subtitle}</div>

      {progress !== undefined && (
        <div className="w-full h-1.5 bg-white-5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}
