
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, CheckCircle2, Star, TrendingUp, Gift, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldenButton } from '@/components/ui/GoldenButton';

const missions = [
  { 
    id: 1, 
    title: "Daily Check-in", 
    reward: "+500 Coins", 
    desc: "Claim your daily reward now", 
    status: "ready", 
    icon: Gift 
  },
  { 
    id: 2, 
    title: "Watch Video Ad", 
    reward: "+200 Coins", 
    desc: "Watch a 30s ad to earn gold", 
    status: "available", 
    icon: Play 
  },
  { 
    id: 3, 
    title: "Complete Survey", 
    reward: "+5,000 Coins", 
    desc: "Share your opinion and earn big", 
    status: "available", 
    icon: CheckCircle2 
  },
];

export default function EarnPage() {
  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-20 overflow-hidden">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-8">
        {/* Page Title */}
        <header className="mt-8 text-center space-y-1">
          <h1 className="text-glowearn-gold font-headline text-3xl font-black italic tracking-[0.15em] uppercase">
            MISSION CENTER
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Complete tasks to earn real gold
          </p>
        </header>

        {/* Featured Offer */}
        <section>
          <Card className="bg-gradient-to-br from-glowearn-gold/20 to-transparent border-glowearn-gold/40 rounded-[2.5rem] overflow-hidden backdrop-blur-md relative golden-glow group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Star size={80} className="text-glowearn-gold fill-glowearn-gold" />
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-glowearn-gold p-1 rounded-sm">
                  <TrendingUp size={12} className="text-glowearn-navy" />
                </div>
                <span className="text-glowearn-gold font-black text-[10px] uppercase tracking-widest">Featured High Reward</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-white font-black text-2xl uppercase tracking-tight">The Big Spin Challenge</h2>
                <p className="text-white/60 text-xs">Unlock a chance to win up to 50,000 extra coins this week.</p>
              </div>
              <div className="pt-2">
                <GoldenButton className="py-3 text-sm">
                  Start Challenge
                </GoldenButton>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Daily Tasks List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-glowearn-gold font-bold uppercase tracking-widest text-xs">Daily Missions</h3>
            <span className="text-white/20 text-[9px] font-bold uppercase">Refreshes in 12h</span>
          </div>

          <div className="space-y-3">
            {missions.map((mission) => (
              <Card 
                key={mission.id} 
                className="bg-[#0c2436]/60 border-white/5 hover:border-glowearn-gold/30 rounded-[1.5rem] transition-all cursor-pointer group backdrop-blur-sm"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-glowearn-navy border border-white/10 p-3 rounded-2xl group-hover:border-glowearn-gold/40 transition-colors">
                      <mission.icon className={cn("transition-colors", mission.status === 'ready' ? "text-glowearn-gold" : "text-white/40")} size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{mission.title}</h4>
                      <p className="text-white/40 text-[10px] uppercase font-bold">{mission.desc}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-glowearn-gold font-black text-xs italic">{mission.reward}</span>
                    <div className="bg-glowearn-gold/10 p-1 rounded-full text-glowearn-gold group-hover:bg-glowearn-gold group-hover:text-glowearn-navy transition-all">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Earn Tip */}
        <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6 flex items-center gap-4">
          <div className="text-glowearn-gold animate-pulse">
            <Zap size={24} className="fill-glowearn-gold" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-tight">
            Tip: Users who complete at least 3 tasks daily earn <span className="text-glowearn-gold">2x multipliers</span> on weekend rewards!
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
