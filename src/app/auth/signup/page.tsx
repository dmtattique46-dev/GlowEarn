
"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { User, Phone, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account Created!",
      description: "Welcome to the GlowEarn community.",
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
            Join GlowEarn
          </h1>
          <p className="text-white/60 text-sm mt-2">Start your journey to premium earnings</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <GoldenInput 
            icon={User} 
            label="Full Name" 
            placeholder="John Doe" 
            required 
          />
          <GoldenInput 
            icon={Phone} 
            label="Mobile Number" 
            placeholder="+1 234 567 890" 
            type="tel"
            required 
          />
          <GoldenInput 
            icon={Mail} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email"
            required 
          />
          <GoldenInput 
            icon={Lock} 
            label="Create Password" 
            placeholder="••••••••" 
            type="password"
            required 
          />
          <GoldenInput 
            icon={CheckCircle2} 
            label="Confirm Password" 
            placeholder="••••••••" 
            type="password"
            required 
          />

          <div className="pt-4">
            <GoldenButton type="submit">
              Sign Up Now
            </GoldenButton>
          </div>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
          Already have an account?{" "}
          <button 
            onClick={() => router.push('/auth/login')}
            className="text-glowearn-gold font-bold hover:underline"
          >
            Log In
          </button>
        </p>
      </main>
    </div>
  );
}
