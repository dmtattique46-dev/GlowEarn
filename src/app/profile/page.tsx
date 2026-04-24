"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Puzzle, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const dailyGoals = [
    { label: "Clear 5 Lines:", progress: 60, current: 3, total: 5 },
    { label: "Clear 10 Lines:", progress: 40, current: 4, total: 10 },
    { label: "Weekly Challenge:", progress: 66, current: 2, total: 3 },
  ];

  const badges = [
    { 
      title: "Puzzle Badge", 
      desc: "Clear over 100 near puzzle themes puzzle formends.",
      icon: Puzzle,
    },
    { 
      title: "Puzzle Badge", 
      desc: "Complete only the puzzle from top is emoircon badges.",
      icon: Puzzle,
    }
  ];

  const stats = [
    { label: "Total Points:", value: "75,000", color: "text-glowearn-gold" },
    { label: "Best Line Clear:", value: "2 Lines", color: "text-white" },
    { label: "Games Played:", value: "250", color: "text-white" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-6">
        {/* User Hero Section */}
        <header className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-glowearn-gold golden-glow scale-105"></div>
            <Avatar className="h-28 w-28 border-2 border-glowearn-navy">
              <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" />
              <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-black text-3xl">U</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-4 flex items-center gap-1 bg-glowearn-gold px-3 py-1 rounded-full shadow-lg">
              <Sparkles size={10} className="text-glowearn-navy" />
              <span className="text-glowearn-navy font-black text-[9px] uppercase">Level Up!</span>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <h1 className="text-white font-headline text-2xl font-black uppercase tracking-tight">WELCOME, User123!</h1>
            <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              LEVEL 15, Master Puzzler
            </p>
          </div>
        </header>

        {/* Achievements Card */}
        <section className="space-y-4">
          <Card className="bg-[#0c2436]/60 border-none rounded-[2rem] overflow-hidden backdrop-blur-xl neon-gold-border">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-glowearn-gold font-headline font-black text-lg text-center uppercase tracking-widest border-b border-glowearn-gold/10 pb-4">
                ACHIEVEMENTS
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-glowearn-gold font-bold text-xs">Daily Goals</h4>
                  {dailyGoals.map((goal, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-white/70">{goal.label}</span>
                        <span className="text-white">{goal.current}/{goal.total}]</span>
                      </div>
                      <Progress value={goal.progress} className="h-2 bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 pt-4 border-t border-white/5">
                {badges.map((badge, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="bg-glowearn-gold/10 p-2.5 rounded-xl border border-glowearn-gold/20">
                      <badge.icon className="text-glowearn-gold" size={20} />
                    </div>
                    <div>
                      <h5 className="text-glowearn-gold font-black text-[11px] uppercase tracking-tight">{badge.title}</h5>
                      <p className="text-white/40 text-[9px] leading-relaxed mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Statistics Section */}
        <section>
          <Card className="bg-[#0c2436]/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-md">
            <CardContent className="p-8">
              <h3 className="text-white font-headline font-black text-base text-center uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                STATISTICS
              </h3>
              <div className="space-y-4">
                {stats.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="text-white/50 font-bold text-[11px] uppercase">{stat.label}</span>
                    <span className={cn("font-black text-base", stat.color)}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Logout Section */}
        <button 
          onClick={() => router.push('/auth/signup')}
          className="w-full flex items-center justify-between p-5 bg-red-500/5 rounded-[2rem] border border-red-500/10 hover:bg-red-500/10 transition-all group mt-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20">
              <LogOut size={18} />
            </div>
            <span className="text-red-500 font-bold text-xs tracking-wide">Logout Account</span>
          </div>
          <ChevronRight size={16} className="text-red-500/20" />
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
