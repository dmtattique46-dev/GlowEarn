
"use client"

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, DollarSign, Target, Trophy } from 'lucide-react';
import { aiEarningRecommendations } from '@/ai/flows/ai-earning-recommendations';
import type { AiEarningRecommendationsOutput } from '@/ai/flows/ai-earning-recommendations';
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [recommendations, setRecommendations] = useState<AiEarningRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAiTips() {
      try {
        const result = await aiEarningRecommendations({
          userId: "user-123",
          userProfile: "Ambitious earner, likes surveys and quick tasks, active daily.",
          userActivityHistory: "Completed 5 surveys yesterday, total earnings $24.50. High engagement in gaming offers."
        });
        setRecommendations(result);
      } catch (error) {
        console.error("AI error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAiTips();
  }, []);

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-6">
        {/* Welcome Section */}
        <section className="mt-4">
          <h2 className="text-white font-headline text-2xl font-black uppercase tracking-tight">
            Hello, <span className="text-glowearn-gold">Glow Earner!</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">Your daily potential is glowing today.</p>
        </section>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/5 border-glowearn-gold/20 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-glowearn-gold/20 p-2 rounded-full mb-2">
                <DollarSign className="text-glowearn-gold" size={20} />
              </div>
              <span className="text-white/40 text-[10px] uppercase font-bold">Earnings</span>
              <span className="text-glowearn-gold font-headline font-black text-xl">$1,240.50</span>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-glowearn-gold/20 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-glowearn-gold/20 p-2 rounded-full mb-2">
                <TrendingUp className="text-glowearn-gold" size={20} />
              </div>
              <span className="text-white/40 text-[10px] uppercase font-bold">Rank</span>
              <span className="text-glowearn-gold font-headline font-black text-xl">#12</span>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="text-glowearn-gold" size={18} />
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">AI Smart Recommendations</h3>
          </div>
          
          <Card className="bg-glowearn-navy border border-glowearn-gold/40 relative overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(250,219,59,0.1)]">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Sparkles className="text-glowearn-gold" size={60} />
            </div>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-20 w-full bg-white/10" />
                </div>
              ) : (
                <>
                  <p className="text-glowearn-gold font-semibold text-lg italic leading-tight">
                    "{recommendations?.summary}"
                  </p>
                  <ul className="mt-4 space-y-3">
                    {recommendations?.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 items-start group">
                        <div className="bg-glowearn-gold rounded-full p-1 mt-1 group-hover:scale-110 transition-transform">
                          <Target size={12} className="text-glowearn-navy" />
                        </div>
                        <span className="text-white/80 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions / Active Tasks */}
        <section className="space-y-4">
          <h3 className="text-white/40 font-bold uppercase tracking-widest text-xs px-1">Trending Opportunities</h3>
          {[
            { title: "Watch & Earn", desc: "Watch 30s ads for quick coins", reward: "$0.05", icon: Sparkles },
            { title: "Weekly Challenge", desc: "Top 10 sharers get bonus gold", reward: "$5.00", icon: Trophy },
          ].map((task, idx) => (
            <Card key={idx} className="bg-white/5 border-glowearn-gold/10 rounded-2xl hover:border-glowearn-gold/30 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-glowearn-navy border border-glowearn-gold/20 p-3 rounded-xl">
                    <task.icon className="text-glowearn-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{task.title}</h4>
                    <p className="text-white/40 text-[11px]">{task.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-glowearn-gold font-black text-sm">{task.reward}</span>
                  <span className="text-[10px] text-white/40 uppercase font-bold">Earn</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
