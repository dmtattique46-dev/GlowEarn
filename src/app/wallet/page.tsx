
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Plus } from 'lucide-react';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-8">
        <header className="mt-4 flex justify-between items-end">
          <div>
            <h2 className="text-white/60 font-bold uppercase tracking-widest text-xs">My Wallet</h2>
            <h1 className="text-white font-headline text-3xl font-black mt-1">Available <span className="text-glowearn-gold">Gold</span></h1>
          </div>
          <div className="bg-glowearn-gold/10 p-3 rounded-2xl">
            <Wallet className="text-glowearn-gold" size={24} />
          </div>
        </header>

        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-glowearn-gold/20 via-glowearn-navy to-glowearn-navy border-2 border-glowearn-gold/40 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(250,219,59,0.15)]">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/40 text-sm font-bold uppercase tracking-wider">Total Balance</p>
                <h3 className="text-glowearn-gold text-5xl font-black mt-2 tracking-tighter">$1,240.50</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <span className="text-green-400 font-bold text-xs">+12.5%</span>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10">
                <ArrowDownLeft size={18} className="text-glowearn-gold" />
                <span className="text-white font-bold text-sm">Withdraw</span>
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10">
                <ArrowUpRight size={18} className="text-glowearn-gold" />
                <span className="text-white font-bold text-sm">Send</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Deposit */}
        <GoldenButton className="rounded-2xl shadow-none h-14">
          <Plus size={20} className="mr-2" /> Deposit Funds
        </GoldenButton>

        {/* Transaction History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <History className="text-glowearn-gold/60" size={16} />
              <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs">Recent History</h3>
            </div>
            <button className="text-glowearn-gold text-[10px] font-black uppercase hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {[
              { title: "Task Reward: Survey X12", date: "Today, 2:30 PM", amount: "+$24.50", type: "earn" },
              { title: "Withdrawal to Bank", date: "Yesterday, 10:15 AM", amount: "-$150.00", type: "withdraw" },
              { title: "Daily Login Bonus", date: "2 days ago", amount: "+$1.00", type: "earn" },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-glowearn-gold/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-xl border",
                    tx.type === 'earn' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                  )}>
                    {tx.type === 'earn' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{tx.title}</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold">{tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-black text-sm",
                  tx.type === 'earn' ? "text-green-500" : "text-white"
                )}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
