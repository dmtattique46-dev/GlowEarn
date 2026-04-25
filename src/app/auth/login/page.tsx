
"use client"

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('glowearn_current_user', JSON.stringify(user));
      toast({
        title: "Welcome Back!",
        description: "You've successfully logged into GlowEarn.",
      });
      router.push('/');
    } else {
      setError('Invalid email or password!');
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <FloatingElements />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
            GlowEarn Login
          </h1>
          <p className="text-white/60 text-sm mt-2">Resume your earning adventure</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <GoldenInput 
            icon={Mail} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <GoldenInput 
            icon={Lock} 
            label="Password" 
            placeholder="••••••••" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <div className="flex justify-end">
            <button type="button" className="text-white/40 text-xs font-bold uppercase hover:text-glowearn-gold">
              Forgot Password?
            </button>
          </div>

          <div className="pt-4">
            <GoldenButton type="submit">
              Log In Now
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
