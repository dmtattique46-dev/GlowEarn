
"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="green-header-gradient h-16 flex items-center justify-between px-6 shadow-lg border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-glowearn-gold animate-pulse"></div>
            <Avatar className="h-10 w-10 border-2 border-glowearn-gold cursor-pointer" onClick={() => router.push('/profile')}>
              <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" alt="User Avatar" />
              <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-bold">GE</AvatarFallback>
            </Avatar>
          </div>
          <span className="font-headline font-extrabold text-white text-xl tracking-tight">GlowEarn</span>
        </div>
        <button 
          onClick={() => router.push('/auth/signup')}
          className="text-white font-bold tracking-widest text-sm hover:opacity-80 transition-opacity"
        >
          SIGNUP
        </button>
      </div>
    </header>
  );
}
