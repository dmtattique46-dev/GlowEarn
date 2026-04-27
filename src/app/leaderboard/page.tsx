
"use client"

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (!session) {
      router.push('/auth/signup');
    } else {
      setUser(JSON.parse(session));
    }
  }, [router]);

  const topUsers = [
    { rank: 1, name: "SpinPro22", earnings: "1,500,000", avatarSeed: "spin" },
    { rank: 2, name: "GameQueen", earnings: "1,250,000", avatarSeed: "queen" },
    { rank: 3, name: "CoinHunter", earnings: "950,000", avatarSeed: "hunter" },
    { rank: 4, name: "CoinHunter", earnings: "700,000", avatarSeed: "c4" },
    { rank: 5, name: "GameQueen", earnings: "600,000", avatarSeed: "g5" },
    { rank: 6, name: "User1233", earnings: "450,000", avatarSeed: "u6" },
    { rank: 7, name: "Ballabavis", earnings: "380,000", avatarSeed: "b7" },
    { rank: 8, name: "User123", earnings: "310,000", avatarSeed: "u8" },
    { rank: 9, name: "GameQueen", earnings: "200,000", avatarSeed: "g9" },
    { rank: 10, name: "User123", earnings: "90,000", avatarSeed: "u10" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20 bg-[#081926]">
      <FloatingElements />
      <Header 
        usdBalance={user?.balance || 0} 
        coinCount={user?.points || 0} 
        xp={user?.xp || 0}
        isAdmin={user?.isAdmin}
      />
      
      <main className="relative z-10 px-4 max-w-2xl mx-auto space-y-6">
        <header className="mt-8 text-center">
          <h1 className="text-glowearn-gold font-headline text-3xl font-black italic tracking-[0.15em] uppercase">
            LEADERBOARD
          </h1>
        </header>

        <section className="neon-gold-border bg-[#0c2436]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md mb-8">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-[1fr_2fr_1.5fr] px-4 py-2 border-b border-white/5 mb-2">
              <span className="text-glowearn-gold/60 font-bold text-[11px] uppercase tracking-wider">Rank</span>
              <span className="text-glowearn-gold/60 font-bold text-[11px] uppercase tracking-wider">Username</span>
              <span className="text-glowearn-gold/60 font-bold text-[11px] uppercase tracking-wider text-right">Total Coins</span>
            </div>

            <div className="space-y-1">
              {topUsers.map((user) => {
                const isTop3 = user.rank <= 3;
                const isRank1 = user.rank === 1;

                return (
                  <div 
                    key={user.rank} 
                    className={cn(
                      "grid grid-cols-[1fr_2fr_1.5fr] items-center px-4 py-3 rounded-2xl transition-all relative",
                      isRank1 && "bg-glowearn-gold/10 border border-glowearn-gold/30",
                      isTop3 && !isRank1 && "bg-white/5"
                    )}
                  >
                    <div className="flex flex-col items-start relative">
                      {isTop3 && (
                        <div className="absolute -top-4 left-1 text-glowearn-gold">
                          <Crown size={14} className="fill-glowearn-gold" />
                        </div>
                      )}
                      {isRank1 && (
                        <div className="absolute -left-2 top-0 text-glowearn-gold/40 animate-pulse">
                          <Sparkles size={16} />
                        </div>
                      )}
                      <span className={cn(
                        "font-black italic text-lg leading-none",
                        isTop3 ? "text-glowearn-gold" : "text-white/30"
                      )}>
                        {user.rank}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className={cn(
                        "h-8 w-8",
                        isTop3 ? "border border-glowearn-gold/50" : "border border-white/10"
                      )}>
                        <AvatarImage src={`https://picsum.photos/seed/${user.avatarSeed}/200/200`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        "text-sm font-bold truncate",
                        isTop3 ? "text-white" : "text-white/70"
                      )}>
                        {user.name}
                      </span>
                    </div>

                    <div className="text-right flex flex-col">
                      <span className={cn(
                        "font-black text-sm",
                        isTop3 ? "text-glowearn-gold" : "text-white/80"
                      )}>
                        {user.earnings}
                      </span>
                      <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Coins</span>
                      {isRank1 && (
                        <div className="absolute right-2 top-2 text-glowearn-gold/40">
                          <Sparkles size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
