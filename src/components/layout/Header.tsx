
"use client"

import React, { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  usdBalance?: number;
  coinCount?: number;
  animate?: boolean;
}

export function Header({ usdBalance = 0.00, coinCount = 0, animate = false }: HeaderProps) {
  const router = useRouter();
  const [showXpTooltip, setShowXpTooltip] = useState(false);

  const levelingData = useMemo(() => {
    let level = 1;
    let xp = coinCount;
    let xpForNext = 100;
    
    // Fast Track 1-15
    while (level < 15 && xp >= 100) {
      xp -= 100;
      level++;
    }
    
    // Exponential 15+
    if (level >= 15) {
      xpForNext = 100 * Math.pow(1.2, level - 15);
      while (xp >= xpForNext) {
        xp -= xpForNext;
        level++;
        xpForNext = 100 * Math.pow(1.2, level - 15);
      }
    }
    
    return {
      level,
      progress: (xp / xpForNext) * 100,
      isPro: level >= 15
    };
  }, [coinCount]);

  const handleInteractionStart = () => setShowXpTooltip(true);
  const handleInteractionEnd = () => setShowXpTooltip(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
      <div className="green-header-gradient h-24 flex flex-col justify-center px-6 shadow-2xl border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar 
              className="h-11 w-11 border-2 border-glowearn-gold cursor-pointer golden-glow" 
              onClick={() => router.push('/profile')}
            >
              <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" alt="User Avatar" />
              <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-bold">U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white/70 text-[11px] font-bold">Welcome Back,</span>
              <div className="flex items-center gap-2 relative">
                <span className="font-headline font-black text-glowearn-gold text-base tracking-tight leading-tight">GlowEarner</span>
                
                {/* Level Badge with Tooltip Trigger */}
                <div className="relative">
                  <span 
                    onPointerDown={handleInteractionStart}
                    onPointerUp={handleInteractionEnd}
                    onPointerLeave={handleInteractionEnd}
                    onContextMenu={(e) => e.preventDefault()}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider cursor-help transition-all active:scale-110 select-none",
                      levelingData.isPro ? "bg-glowearn-gold text-glowearn-navy" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    )}
                  >
                    Lvl {levelingData.level}
                  </span>

                  {/* XP Tooltip */}
                  {showXpTooltip && (
                    <div className="absolute top-full left-0 mt-2 z-[60] bg-black/95 border border-glowearn-gold/40 rounded-lg px-3 py-2 backdrop-blur-xl shadow-[0_0_20px_rgba(250,219,59,0.3)] animate-in fade-in zoom-in duration-200 min-w-[100px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-glowearn-gold font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                          Total XP: {Math.floor(coinCount).toLocaleString()}
                        </span>
                        <div className="h-0.5 w-full bg-glowearn-gold/20 rounded-full overflow-hidden">
                          <div className="h-full bg-glowearn-gold" style={{ width: `${levelingData.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Balance Card Updated */}
          <div className={cn(
            "glass-box p-2.5 px-4 rounded-2xl flex flex-col items-end gap-0.5 transition-all duration-300 min-w-[100px]",
            animate && "scale-110 border-glowearn-gold shadow-[0_0_20px_rgba(250,219,59,0.4)]"
          )}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full bg-glowearn-gold shadow-[0_0_5px_#fadb3b]",
                animate && "animate-ping"
              )}></div>
              <span className="text-glowearn-gold font-black text-xs">${usdBalance.toFixed(2)} USD</span>
            </div>
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-wider">
              {Math.floor(coinCount).toLocaleString()} COINS
            </span>
          </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40">
            <span>Progress to Lvl {levelingData.level + 1}</span>
            <span>{Math.round(levelingData.progress)}%</span>
          </div>
          <Progress 
            value={levelingData.progress} 
            className={cn(
              "h-1.5 bg-black/40",
              levelingData.isPro ? "[&>div]:bg-glowearn-gold" : "[&>div]:bg-blue-500"
            )} 
          />
        </div>
      </div>
    </header>
  );
}
