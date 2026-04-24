
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const menuItems = [
    { icon: Settings, label: "Account Settings", color: "text-blue-400" },
    { icon: Shield, label: "Security & Privacy", color: "text-glowearn-gold" },
    { icon: Bell, label: "Notifications", color: "text-green-400" },
    { icon: HelpCircle, label: "Help & Support", color: "text-purple-400" },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Info */}
        <header className="mt-8 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full border-4 border-glowearn-gold golden-glow scale-110"></div>
            <Avatar className="h-28 w-28 border-2 border-glowearn-navy cursor-pointer">
              <AvatarImage src="https://picsum.photos/seed/gold-avatar/200/200" />
              <AvatarFallback className="bg-glowearn-gold text-glowearn-navy font-black text-3xl">GE</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-glowearn-gold p-2 rounded-full text-glowearn-navy shadow-lg hover:scale-110 transition-transform">
              <Edit3 size={16} strokeWidth={3} />
            </button>
          </div>
          
          <div className="text-center mt-6">
            <h1 className="text-white font-headline text-3xl font-black uppercase tracking-tight">John Doe</h1>
            <p className="text-glowearn-gold font-bold text-xs uppercase tracking-[0.2em] mt-1">PRO MEMBER • LVL 12</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 w-full border-y border-white/5 py-6">
            <div className="text-center">
              <span className="block text-white font-black text-xl">124</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Tasks</span>
            </div>
            <div className="text-center border-x border-white/5">
              <span className="block text-glowearn-gold font-black text-xl">1.2K</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-white font-black text-xl">4.8</span>
              <span className="text-white/40 text-[10px] font-bold uppercase">Rating</span>
            </div>
          </div>
        </header>

        {/* Menu List */}
        <section className="space-y-3">
          {menuItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-glowearn-gold/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors", item.color)}>
                  <item.icon size={20} />
                </div>
                <span className="text-white font-bold text-sm tracking-wide">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-glowearn-gold transition-colors" />
            </div>
          ))}

          <button 
            onClick={() => router.push('/auth/signup')}
            className="w-full flex items-center justify-between p-5 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-all group mt-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20">
                <LogOut size={20} />
              </div>
              <span className="text-red-500 font-bold text-sm tracking-wide">Logout Account</span>
            </div>
            <ChevronRight size={18} className="text-red-500/20" />
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
