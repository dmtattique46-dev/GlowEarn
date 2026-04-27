
"use client"

import React, { useState } from 'react';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { User, Phone, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (showDevLogin) {
      // Developer Master Login Logic
      if (formData.email === 'developerge@gmail.com' && formData.password === '123456') {
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
      return;
    }

    // Regular User Signup Logic
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    
    // Unique Mobile Check
    const exists = users.find((u: any) => u.mobile === formData.mobile);
    if (exists) {
      setError('This number is already registered. Please login instead.');
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      mobile: formData.mobile,
      balance: 0.00,
      points: 0,
      xp: 0,
      isPlayer: true,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('glowearn_users', JSON.stringify(users));
    localStorage.setItem('glowearn_current_user', JSON.stringify(newUser));

    toast({
      title: "Account Created!",
      description: "Welcome to the GlowEarn community.",
    });
    
    router.push('/');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 bg-glowearn-navy">
      <FloatingElements />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 
            onClick={() => setShowDevLogin(!showDevLogin)}
            className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter cursor-pointer select-none"
          >
            Join GlowEarn
          </h1>
          <p className="text-white/60 text-sm mt-2">Start your journey to premium earnings</p>
          {showDevLogin && (
            <div className="mt-2 inline-flex items-center gap-2 bg-glowearn-gold/10 px-3 py-1 rounded-full border border-glowearn-gold/30">
              <ShieldCheck size={14} className="text-glowearn-gold" />
              <span className="text-glowearn-gold text-[9px] font-black uppercase tracking-widest">Dev Mode Active</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          {!showDevLogin ? (
            <div className="space-y-6 animate-in fade-in">
              <GoldenInput 
                icon={User} 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <div className="flex items-center gap-2">
                <span className="bg-white/5 border border-white/10 px-4 py-4 rounded-2xl text-white font-bold text-sm h-[58px] flex items-center mt-6">+92</span>
                <div className="flex-1">
                  <GoldenInput 
                    icon={Phone} 
                    label="Mobile Number" 
                    placeholder="3XX XXXXXXX" 
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    required 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <GoldenInput 
                icon={Mail} 
                label="Admin Email" 
                placeholder="developerge@gmail.com" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
              <GoldenInput 
                icon={Lock} 
                label="Master Key" 
                placeholder="••••••••" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
          )}

          <div className="pt-4">
            <GoldenButton type="submit">
              {showDevLogin ? 'Authorize Dev Account' : 'Sign Up Now'}
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
