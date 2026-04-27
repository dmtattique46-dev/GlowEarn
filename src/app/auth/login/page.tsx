
"use client"

import React, { useState } from 'react';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Phone, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDevLogin, setShowDevLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');

    if (showDevLogin) {
      // Developer Master Login Logic
      if (email === 'developerge@gmail.com' && password === '123456') {
        const devUser = {
          id: 'dev-001',
          name: 'Developer Admin',
          email: 'developerge@gmail.com',
          mobile: '0000000000',
          balance: 99999.99,
          points: 99999,
          isAdmin: true,
          isPlayer: false
        };
        localStorage.setItem('glowearn_current_user', JSON.stringify(devUser));
        toast({ title: "Master Access Granted", description: "Logged in as System Developer." });
        router.push('/');
      } else {
        setError('Unauthorized: Only developer can use email access.');
      }
    } else {
      // Regular User Phone Login Logic
      const user = users.find((u: any) => u.mobile === mobile);
      if (user) {
        localStorage.setItem('glowearn_current_user', JSON.stringify({ ...user, isPlayer: true, isAdmin: false }));
        toast({ title: "Welcome Back!", description: "Successfully logged in via mobile." });
        router.push('/');
      } else {
        setError('Number not found! Please sign up first.');
      }
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 bg-glowearn-navy">
      <FloatingElements />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10 relative">
          <h1 
            onClick={() => setShowDevLogin(!showDevLogin)}
            className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter cursor-pointer select-none"
          >
            GlowEarn Login
          </h1>
          <p className="text-white/60 text-sm mt-2">Resume your earning adventure</p>
          {showDevLogin && (
            <div className="absolute -top-6 right-0 text-glowearn-gold/40 animate-pulse">
              <ShieldCheck size={20} />
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          {!showDevLogin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/5 border border-white/10 px-4 py-4 rounded-2xl text-white font-bold text-sm">+92</span>
                <div className="flex-1">
                  <GoldenInput 
                    icon={Phone} 
                    label="Mobile Number" 
                    placeholder="3XX XXXXXXX" 
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
              <div className="bg-glowearn-gold/5 p-3 rounded-xl border border-glowearn-gold/20 mb-4">
                <p className="text-glowearn-gold text-[10px] font-black uppercase text-center">Master Developer Portal</p>
              </div>
              <GoldenInput 
                icon={Mail} 
                label="Admin Email" 
                placeholder="developerge@gmail.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <GoldenInput 
                icon={Lock} 
                label="Master Key" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          )}

          <div className="pt-4">
            <GoldenButton type="submit">
              {showDevLogin ? 'Authorize Access' : 'Log In Now'}
            </GoldenButton>
          </div>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
          New to GlowEarn?{" "}
          <button 
            onClick={() => router.push('/auth/signup')}
            className="text-glowearn-gold font-bold hover:underline"
          >
            Create Account
          </button>
        </p>
      </main>
    </div>
  );
}
