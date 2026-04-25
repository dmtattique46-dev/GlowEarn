
"use client"

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    
    // Check for duplicate number or email
    const exists = users.find((u: any) => u.mobile === formData.mobile || u.email === formData.email);
    
    if (exists) {
      setError('This number or email is already registered. Please login instead.');
      return;
    }

    // Create new user object
    const newUser = {
      ...formData,
      balance: 0.00,
      points: 0,
      level: 1,
      id: Date.now().toString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('glowearn_users', JSON.stringify(users));
    
    // Set active session
    localStorage.setItem('glowearn_current_user', JSON.stringify(newUser));

    toast({
      title: "Account Created!",
      description: "Welcome to the GlowEarn community.",
    });
    
    router.push('/');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <FloatingElements />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
            Join GlowEarn
          </h1>
          <p className="text-white/60 text-sm mt-2">Start your journey to premium earnings</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <GoldenInput 
            icon={User} 
            label="Full Name" 
            placeholder="John Doe" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <GoldenInput 
            icon={Phone} 
            label="Mobile Number" 
            placeholder="+92 3XX XXXXXXX" 
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            required 
          />
          <GoldenInput 
            icon={Mail} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <GoldenInput 
            icon={Lock} 
            label="Create Password" 
            placeholder="••••••••" 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
          <GoldenInput 
            icon={CheckCircle2} 
            label="Confirm Password" 
            placeholder="••••••••" 
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
