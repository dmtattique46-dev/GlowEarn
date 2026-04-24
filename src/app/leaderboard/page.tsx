
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const topUsers = [
    { rank: 1, name: "GoldenEagle", earnings: "$12,450", avatar: "1" },
    { rank: 2, name: "MidasTouch", earnings: "$10,200", avatar: "2" },
    { rank: 3, name: "GlowKing", earnings: "$8,900", avatar: "3" },
    { rank: 4, name: "SurveyPro", earnings: "$7,500", avatar: "4" },
    { rank: 5, name: "CashMagnet", earnings: "$6,800", avatar: "5" },
    { rank: 6, name: "ProfitMaster", earnings: "$5,400", avatar: "6" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-8">
        <header className="mt-4 text-center">
          <h2 className="text-glowearn-gold/60 font-bold uppercase tracking-[0.2em] text-xs">The Glow Hall of Fame</h2>
          <h1 className="text-white font-headline text-4xl font-black mt-2 italic">LEADERBOARD</h1>
        </header>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mt-12 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-slate-400">
                <AvatarImage src={`https://picsum.photos/seed/user2/200/200`} />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-slate-400 rounded-full p-1 text-glowearn-navy">
                <Medal size={16} />
              </div>
            </div>
            <div className="h-24 w-20 bg-slate-400/20 border-t-2 border-slate-400 rounded-t-xl flex flex-col items-center justify-center">
              <span className="text-slate-400 font-black text-xl">2</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Rank</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center gap-3 scale-110">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-glowearn-gold shadow-[0_0_20px_rgba(250,219,59,0.5)]">
                <AvatarImage src={`https://picsum.photos/seed/user1/200/200`} />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 bg-glowearn-gold rounded-full p-1.5 text-glowearn-navy animate-bounce">
                <Trophy size={20} />
              </div>
            </div>
            <div className="h-32 w-24 bg-glowearn-gold/20 border-t-4 border-glowearn-gold rounded-t-xl flex flex-col items-center justify-center">
              <span className="text-glowearn-gold font-black text-3xl">1</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Rank</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-orange-700">
                <AvatarImage src={`https://picsum.photos/seed/user3/200/200`} />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-orange-700 rounded-full p-1 text-glowearn-navy">
                <Medal size={16} />
              </div>
            </div>
            <div className="h-20 w-20 bg-orange-700/20 border-t-2 border-orange-700 rounded-t-xl flex flex-col items-center justify-center">
              <span className="text-orange-700 font-black text-xl">3</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Rank</span>
            </div>
          </div>
        </div>

        {/* List View */}
        <section className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
          {topUsers.slice(3).map((user, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex items-center justify-between p-5 transition-colors hover:bg-white/5",
                idx !== topUsers.slice(3).length - 1 && "border-b border-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-white/30 font-black italic w-6">{user.rank}</span>
                <Avatar className="h-10 w-10 border border-glowearn-gold/20">
                  <AvatarImage src={`https://picsum.photos/seed/list${idx}/200/200`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-bold text-sm">{user.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-glowearn-gold fill-glowearn-gold" />
                    <span className="text-white/40 text-[10px] uppercase font-bold">Elite Earner</span>
                  </div>
                </div>
              </div>
              <span className="text-glowearn-gold font-black text-lg">{user.earnings}</span>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
