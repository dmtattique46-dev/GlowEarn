
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome Back!",
      description: "You've successfully logged into GlowEarn.",
    });
    router.push('/');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
            GlowEarn Login
          </h1>
          <p className="text-white/60 text-sm mt-2">Resume your earning adventure</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <GoldenInput 
            icon={Mail} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email"
            required 
          />
          <GoldenInput 
            icon={Lock} 
            label="Password" 
            placeholder="••••••••" 
            type="password"
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
