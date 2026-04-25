
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
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AiEarningRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (!session) {
      router.push('/auth/signup');
    } else {
      setUser(JSON.parse(session));
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    async function fetchAiTips() {
      try {
        const result = await aiEarningRecommendations({
          userId: user.id,
          userProfile: `Ambitious earner named ${user.name}, likes puzzle games. Current level: ${user.level}`,
          userActivityHistory: `New account with ${user.points} points. Looking to maximize earnings.`
        });
        setRecommendations(result);
      } catch (error) {
        console.error("AI error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAiTips();
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header usdBalance={user.balance} coinCount={user.points} />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-6">
        <section className="mt-4">
          <h2 className="text-white font-headline text-2xl font-black uppercase tracking-tight">
            Hello, <span className="text-glowearn-gold">{user.name.split(' ')[0]}!</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">Your earning potential is glowing today.</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/5 border-glowearn-gold/20 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-glowearn-gold/20 p-2 rounded-full mb-2">
                <DollarSign className="text-glowearn-gold" size={20} />
              </div>
              <span className="text-white/40 text-[10px] uppercase font-bold">Earnings</span>
              <span className="text-glowearn-gold font-headline font-black text-xl">${user.balance.toFixed(2)}</span>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-glowearn-gold/20 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-glowearn-gold/20 p-2 rounded-full mb-2">
                <TrendingUp className="text-glowearn-gold" size={20} />
              </div>
              <span className="text-white/40 text-[10px] uppercase font-bold">Points</span>
              <span className="text-glowearn-gold font-headline font-black text-xl">{user.points.toLocaleString()}</span>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="text-glowearn-gold" size={18} />
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">AI Smart Recommendations</h3>
          </div>
          
          <Card className="bg-glowearn-navy border border-glowearn-gold/40 relative overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(250,219,59,0.1)]">
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                </div>
              ) : (
                <>
                  <p className="text-glowearn-gold font-semibold text-lg italic leading-tight">
                    "{recommendations?.summary}"
                  </p>
                  <ul className="mt-4 space-y-3">
                    {recommendations?.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="bg-glowearn-gold rounded-full p-1 mt-1">
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
      </main>

      <BottomNav />
    </div>
  );
}
