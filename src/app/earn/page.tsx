
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, CheckCircle2, Share2, Gamepad2, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EarnPage() {
  const categories = [
    { title: "Watch Ads", icon: Play, count: "12 Available", color: "from-blue-500/20" },
    { title: "Surveys", icon: CheckCircle2, count: "5 New", color: "from-green-500/20" },
    { title: "Games", icon: Gamepad2, count: "8 Ready", color: "from-purple-500/20" },
    { title: "Invite", icon: Share2, count: "Unlimited", color: "from-glowearn-gold/20" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-8">
        <header className="mt-4">
          <h2 className="text-glowearn-gold/60 font-bold uppercase tracking-widest text-xs">Glow Opportunities</h2>
          <h1 className="text-white font-headline text-3xl font-black mt-1">Start <span className="text-glowearn-gold">Earning</span></h1>
        </header>

        {/* Featured Task */}
        <Card className="bg-gradient-to-br from-glowearn-gold/30 to-glowearn-navy border-glowearn-gold/40 rounded-3xl overflow-hidden relative shadow-[0_0_30px_rgba(250,219,59,0.1)]">
          <div className="absolute top-0 right-0 p-4 animate-pulse">
            <Zap className="text-glowearn-gold fill-glowearn-gold" size={40} />
          </div>
          <CardContent className="p-8">
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Daily Grand Challenge</h3>
            <p className="text-white/60 text-sm mt-2 max-w-[200px]">Complete all daily tasks to unlock the golden vault.</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-glowearn-gold font-black text-4xl">$50.00</span>
              <span className="text-white/40 font-bold text-xs uppercase mb-1">Bonus</span>
            </div>
            <button className="mt-6 bg-white text-glowearn-navy px-8 py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform shadow-xl">
              Start Now
            </button>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <Card key={i} className={cn("bg-white/5 border-white/5 rounded-2xl hover:border-glowearn-gold/30 transition-all cursor-pointer group bg-gradient-to-br to-glowearn-navy", cat.color)}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-white/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="text-glowearn-gold" size={28} />
                </div>
                <h4 className="text-white font-bold text-sm">{cat.title}</h4>
                <p className="text-white/40 text-[10px] uppercase font-bold mt-1 tracking-widest">{cat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Bonus Section */}
        <section className="bg-glowearn-navy border border-glowearn-gold/20 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-glowearn-gold/10 p-3 rounded-full">
              <Gift className="text-glowearn-gold" size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Daily Reward</h4>
              <p className="text-white/40 text-[10px] uppercase font-bold">Claim your gold for today</p>
            </div>
          </div>
          <button className="bg-glowearn-gold/20 text-glowearn-gold border border-glowearn-gold/40 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-glowearn-gold hover:text-glowearn-navy transition-colors">
            Claim
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
