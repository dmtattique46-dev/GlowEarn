
"use client"

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShieldAlert, Ban, Globe, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isVpnDetected, setIsVpnDetected] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (!session) {
      router.push('/auth/signup');
      return;
    }
    const userData = JSON.parse(session);
    setUser(userData);

    // Check for Ban
    if (userData.isAccountBanned) {
      setIsBanned(true);
    }

    // Mock VPN Detection Logic
    // In a real app, this would use an IP-based API or check for unusual timezone/language mismatches.
    const checkVpn = () => {
      // Simulate detection if timezone offset is unusual or just for demo purposes
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Mock logic: trigger if user has a specific flag or randomly for demo (here we just provide the structure)
      if (userData.mockVpnActive) {
        setIsVpnDetected(true);
      }
    };
    
    checkVpn();

    // Cheat Protection: Detect impossible scores (e.g., > 10M points for a basic account)
    if (userData.points > 10000000) {
      const bannedUser = { ...userData, isAccountBanned: true };
      localStorage.setItem('glowearn_current_user', JSON.stringify(bannedUser));
      setIsBanned(true);
      // Update global user list
      const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
      const index = users.findIndex((u: any) => u.id === userData.id);
      if (index !== -1) {
        users[index] = bannedUser;
        localStorage.setItem('glowearn_users', JSON.stringify(users));
      }
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen pb-24 pt-20">
      <FloatingElements />
      <Header usdBalance={user.balance} coinCount={user.points} />
      
      {/* VPN Warning Overlay */}
      {isVpnDetected && (
        <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center">
          <div className="space-y-6">
            <Globe className="mx-auto text-red-500 animate-pulse" size={80} />
            <h1 className="text-white font-black text-3xl uppercase tracking-tighter">VPN Detected!</h1>
            <p className="text-red-200 font-bold">Please disable your VPN to continue or your account will be PERMANENTLY BANNED.</p>
            <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30">
              <span className="text-red-400 text-xs font-black uppercase">Access Restricted</span>
            </div>
          </div>
        </div>
      )}

      {/* Ban Overlay */}
      {isBanned && (
        <div className="fixed inset-0 z-[101] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
          <div className="space-y-6">
            <Ban className="mx-auto text-red-600" size={80} />
            <h1 className="text-white font-black text-3xl uppercase tracking-tighter">Account Banned</h1>
            <p className="text-white/60 font-medium">Suspicious activity detected. This account has been locked for violating security protocols.</p>
            <button 
              onClick={() => {
                localStorage.removeItem('glowearn_current_user');
                router.push('/auth/signup');
              }}
              className="px-8 py-4 bg-red-600 rounded-2xl text-white font-black uppercase tracking-widest"
            >
              Exit Application
            </button>
          </div>
        </div>
      )}

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

        {/* Security Protocol Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert className="text-red-500" size={18} />
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Security Protocol</h3>
          </div>
          
          <Card className="bg-black/60 border-2 border-red-500/50 relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-500/20 p-2 rounded-xl">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase text-sm tracking-tight">Anti-Cheat System Active</h4>
                  <p className="text-red-400/80 text-[10px] font-bold uppercase">Violations will result in immediate ban</p>
                </div>
              </div>
              
              <ul className="space-y-4">
                <li className="flex gap-3 items-start p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <div className="bg-red-500 rounded-full p-1 mt-0.5 shrink-0">
                    <Ban size={10} className="text-white" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs uppercase block">No Mod Apps</span>
                    <p className="text-white/60 text-[10px] mt-1">Modded versions or external injection tools will cause withdrawal failure and payment cancellation.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <div className="bg-red-500 rounded-full p-1 mt-0.5 shrink-0">
                    <Globe size={10} className="text-white" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs uppercase block">No VPN Allowed</span>
                    <p className="text-white/60 text-[10px] mt-1">VPN usage is strictly prohibited. Detection leads to instant account restriction.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
