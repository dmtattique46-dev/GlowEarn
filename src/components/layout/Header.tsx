
"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  usdBalance?: number;
  coinCount?: number;
  animate?: boolean;
}

export function Header({ usdBalance = 20.00, coinCount = 1000000, animate = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
      <div className="green-header-gradient h-20 flex items-center justify-between px-6 shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-11 w-11 border-2 border-glowearn-gold cursor-pointer golden-glow" 
            onClick={() => router.push('/profile')}
          >
            <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" alt="User Avatar" />
            <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-bold">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white/70 text-[11px] font-bold">Welcome,</span>
            <span className="font-headline font-black text-glowearn-gold text-base tracking-tight leading-tight">User123!</span>
          </div>
        </div>

        <div className={cn(
          "glass-box p-2.5 px-4 rounded-2xl flex flex-col items-end gap-0.5 transition-all duration-300",
          animate && "scale-110 border-glowearn-gold shadow-[0_0_20px_rgba(250,219,59,0.4)]"
        )}>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full bg-glowearn-gold shadow-[0_0_5px_#fadb3b]",
              animate && "animate-ping"
            )}></div>
            <span className="text-white font-black text-xs">${usdBalance.toFixed(2)} USD</span>
          </div>
          <span className="text-glowearn-gold font-bold text-[10px] uppercase tracking-wider">
            {Math.floor(coinCount).toLocaleString()} Coins
          </span>
        </div>
      </div>
    </header>
  );
}
