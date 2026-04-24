"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { CircleDollarSign } from 'lucide-react';

export function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="green-header-gradient h-16 flex items-center justify-between px-6 shadow-lg border-b border-white/5">
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-10 w-10 border-2 border-glowearn-gold cursor-pointer" 
            onClick={() => router.push('/profile')}
          >
            <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" alt="User Avatar" />
            <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-bold text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white/60 text-[10px] font-bold leading-tight">Welcome,</span>
            <span className="font-headline font-black text-white text-sm tracking-tight leading-tight">User123!</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-0.5 rounded-full border border-glowearn-gold/20">
            <div className="w-2 h-2 rounded-full bg-glowearn-gold shadow-[0_0_5px_#fadb3b]"></div>
            <span className="text-white font-black text-[11px]">$12.50 USD</span>
          </div>
          <span className="text-glowearn-gold/90 font-bold text-[9px] uppercase tracking-wider pr-1">12,500 Coins</span>
        </div>
      </div>
    </header>
  );
}
