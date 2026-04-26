
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, LogOut, ChevronRight, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
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

  const handleLogout = () => {
    localStorage.removeItem('glowearn_current_user');
    router.push('/auth/signup');
  };

  const leveling = useMemo(() => {
    if (!user) return null;
    let level = 1;
    let xp = user.points || 0;
    let req = 500;
    
    // Fast Track 1-15: 500 XP steps
    while (level < 15 && xp >= 500) {
      xp -= 500;
      level++;
    }
    
    // Exponential 15+: 20% growth
    if (level >= 15) {
      req = 500;
      while (xp >= req) {
        xp -= req;
        level++;
        req = Math.floor(req * 1.2);
      }
    }
    
    return {
      level,
      xp,
      xpForNext: req,
      isMaster: level >= 15
    };
  }, [user]);

  if (!user || !leveling) return null;

  const dailyGoals = [
    { label: "Clear 5 Lines:", progress: 60, current: 3, total: 5 },
    { label: "XP Multiplier Active:", progress: leveling.isMaster ? 0 : 100, current: leveling.isMaster ? 0 : 1, total: 1 },
    { label: "Master Progress:", progress: leveling.isMaster ? (leveling.level / 50) * 100 : 0, current: leveling.level, total: 50 },
  ];

  const stats = [
    { label: "Total XP Collected:", value: user.points.toLocaleString() },
    { label: "Earnings Wallet:", value: `$${user.balance.toFixed(2)}` },
    { label: "Current Rank:", value: leveling.isMaster ? "Glow Master" : "Novice Earner" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-24 bg-[#081926]">
      <FloatingElements />
      <Header usdBalance={user.balance} coinCount={user.points} />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-8 mt-6">
        <header className="flex flex-col items-center">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 rounded-full border-4 golden-glow scale-110",
              leveling.isMaster ? "border-glowearn-gold shadow-[0_0_20px_#fadb3b]" : "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            )}></div>
            <Avatar className="h-24 w-24 border-4 border-glowearn-navy">
              <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" />
              <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-black text-2xl">
                {user.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {leveling.isMaster && (
              <div className="absolute -right-12 top-4 flex items-center gap-1 bg-glowearn-gold px-2 py-1 rounded-full border border-glowearn-gold/20 shadow-lg">
                <Trophy size={10} className="text-glowearn-navy fill-glowearn-navy" />
                <span className="text-glowearn-navy font-black text-[9px] uppercase">Master</span>
              </div>
            )}
            
            {!leveling.isMaster && (
              <div className="absolute -right-12 top-4 flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/30">
                <Sparkles size={10} className="text-blue-400" />
                <span className="text-blue-400 font-black text-[9px] uppercase">Rookie</span>
              </div>
            )}
          </div>
          
          <div className="text-center mt-6">
            <h1 className="text-white font-headline text-2xl font-black uppercase tracking-tight">
              {user.name} <span className="text-glowearn-gold ml-1">Lvl {leveling.level}</span>
            </h1>
            <p className="text-white/70 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
              Member ID: {user.id.slice(-6)}
            </p>
          </div>
        </header>

        <section>
          <Card className={cn(
            "rounded-[2.5rem] overflow-hidden backdrop-blur-xl border transition-all duration-500",
            leveling.isMaster ? "bg-glowearn-gold/5 border-glowearn-gold shadow-[0_0_30px_rgba(250,219,59,0.2)]" : "bg-[#0c2436]/80 border-white/10"
          )}>
            <CardContent className="p-8 space-y-6">
              <h3 className="text-glowearn-gold font-headline font-black text-lg text-center uppercase tracking-widest border-b border-glowearn-gold/10 pb-4">
                LEVELING PROGRESS
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-glowearn-gold/80 font-bold text-xs uppercase tracking-widest">Experience (XP)</h4>
                  <span className="text-[10px] text-white/40 font-bold uppercase">{Math.floor(leveling.xp)} / {Math.floor(leveling.xpForNext)} XP</span>
                </div>
                <Progress 
                  value={(leveling.xp / leveling.xpForNext) * 100} 
                  className={cn(
                    "h-3 bg-black/40",
                    leveling.isMaster ? "[&>div]:bg-glowearn-gold" : "[&>div]:bg-blue-500"
                  )} 
                />
                
                <div className="pt-4 grid grid-cols-1 gap-3">
                  {dailyGoals.map((goal, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/60">{goal.label}</span>
                        <span className="text-white">{goal.current}/{goal.total}</span>
                      </div>
                      <Progress value={goal.progress} className="h-1.5 bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#0c2436]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <CardContent className="p-8">
              <h3 className="text-white/70 font-headline font-black text-base text-center uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                STATISTICS
              </h3>
              <div className="space-y-5">
                {stats.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-white/60 font-bold text-xs uppercase tracking-wide">{stat.label}</span>
                    <span className="font-black text-xl text-glowearn-gold italic">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-6 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 hover:bg-red-500/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20">
              <LogOut size={20} />
            </div>
            <span className="text-red-500 font-bold text-sm tracking-wide uppercase">Sign Out Account</span>
          </div>
          <ChevronRight size={18} className="text-red-500/20" />
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
