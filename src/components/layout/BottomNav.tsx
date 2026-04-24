
"use client"

import React from 'react';
import { Home, Zap, Wallet, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Earn', icon: Zap, href: '/earn' },
  { label: 'Wallet', icon: Wallet, href: '/wallet' },
  { label: 'Leaders', icon: Trophy, href: '/leaderboard' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 group w-16"
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "text-glowearn-gold scale-110" : "text-white/60 group-hover:text-white"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider transition-colors",
              isActive ? "text-glowearn-gold" : "text-white/40"
            )}>
              {item.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-glowearn-gold mt-1 shadow-[0_0_5px_#fadb3b]"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
