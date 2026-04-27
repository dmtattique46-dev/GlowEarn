
"use client"

import React, { useState } from 'react';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Phone, Mail, Lock, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDevMode, setIsDevMode] = useState(false);
  const [showSecurityCheck, setShowSecurityCheck] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === "Pakistan") || COUNTRIES[0]);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qAnswers, setQAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Developer Master Portal Interception
    if (isDevMode) {
      if (email === 'developerge@gmail.com' && password === '123456') {
        // Stop redirection here - trigger security questions instead
        setShowSecurityCheck(true);
      } else {
        setError('Unauthorized: Only developer can use this feature.');
      }
      return;
    }

    // Standard User Login via Mobile
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    const fullNumber = selectedCountry.code + mobile;
    const user = users.find((u: any) => u.mobile === fullNumber);

    if (user) {
      if (user.isAccountBanned) {
        setError('Your account is banned for security violations.');
        return;
      }
      localStorage.setItem('glowearn_current_user', JSON.stringify({ ...user, isPlayer: true, isAdmin: false }));
      toast({ title: "Welcome Back!", description: "Successfully logged in via mobile." });
      router.push('/');
    } else {
      setError('Number not found! Please sign up first.');
    }
  };

  const handleVerifyQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Secret Answers Validation
    const isQ1Ok = qAnswers.q1.toLowerCase() === 'no';
    const isQ2Ok = qAnswers.q2.toUpperCase() === 'ATTIQUE RAZA';
    const isQ3Ok = qAnswers.q3 === '2026';

    if (isQ1Ok && isQ2Ok && isQ3Ok) {
      const devUser = {
        id: 'dev-master-admin',
        name: 'Developer Admin',
        email: 'developerge@gmail.com',
        isAdmin: true,
        isPlayer: false,
        balance: 1000.00,
        points: 99999999,
        xp: 10000000,
        isAccountBanned: false,
        emailVerified: true,
        phoneVerified: true
      };
      localStorage.setItem('glowearn_current_user', JSON.stringify(devUser));
      toast({ title: "Admin Identity Verified", description: "Unlimited resources and Master access enabled." });
      router.push('/');
    } else {
      // Penalty: Permanent Account Ban
      const bannedUser = { 
        id: 'dev-failed-auth', 
        email: 'developerge@gmail.com', 
        isAccountBanned: true,
        name: 'Failed Admin Attempt'
      };
      localStorage.setItem('glowearn_current_user', JSON.stringify(bannedUser));
      toast({ variant: "destructive", title: "Security Breach Detected", description: "Identity verification failed. Device has been flagged." });
      router.push('/'); // Redirect to Home to show Ban Overlay
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 bg-glowearn-navy">
      <FloatingElements />
      
      <main className="relative z-10 px-6 max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
            {showSecurityCheck ? 'Identity Verification' : 'GlowEarn Login'}
          </h1>
          <p className="text-white/60 text-sm mt-2">
            {showSecurityCheck ? 'Verify Security Protocol' : 'Resume your earning adventure'}
          </p>
        </div>

        {!showSecurityCheck ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            {!isDevMode ? (
              <div className="space-y-4">
                <label className="text-glowearn-gold/80 text-xs font-bold uppercase tracking-widest px-1">Country & Mobile</label>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={(val) => setSelectedCountry(COUNTRIES.find(c => c.name === val) || COUNTRIES[0])}
                    defaultValue={selectedCountry.name}
                  >
                    <SelectTrigger className="w-[110px] bg-glowearn-navy/50 border-glowearn-gold/30 rounded-2xl h-[58px] text-white">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <span>{selectedCountry.flag}</span>
                          <span className="text-sm font-bold">{selectedCountry.code}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-glowearn-navy border-glowearn-gold/30 text-white max-h-[300px]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.name} value={c.name} className="hover:bg-glowearn-gold/10">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{c.flag}</span>
                            <span className="font-medium text-xs">{c.name}</span>
                            <span className="text-white/40 text-[10px] ml-auto">{c.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <GoldenInput 
                      icon={Phone} 
                      placeholder="Mobile Number" 
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      required 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95">
                <GoldenInput 
                  icon={Mail} 
                  label="Admin Email" 
                  placeholder="Enter Admin Email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <GoldenInput 
                  icon={Lock} 
                  label="Master Key" 
                  placeholder="Enter Master Key" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            )}

            <div className="pt-4">
              <GoldenButton type="submit">
                {isDevMode ? 'Next Step' : 'Log In Now'}
              </GoldenButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyQuestions} className="space-y-6 animate-in slide-in-from-bottom-8">
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-3xl mb-6">
              <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest leading-relaxed">
                Security Protocol Level 2 Active. Any wrong answer will result in permanent device ban.
              </p>
            </div>
            
            <GoldenInput 
              icon={HelpCircle}
              label="Q1: You are developer?"
              placeholder="Enter Answer"
              value={qAnswers.q1}
              onChange={(e) => setQAnswers({...qAnswers, q1: e.target.value})}
              required
            />
            <GoldenInput 
              icon={HelpCircle}
              label="Q2: This app made by?"
              placeholder="Full Name"
              value={qAnswers.q2}
              onChange={(e) => setQAnswers({...qAnswers, q2: e.target.value})}
              required
            />
            <GoldenInput 
              icon={HelpCircle}
              label="Q3: This app develop in?"
              placeholder="Year"
              value={qAnswers.q3}
              onChange={(e) => setQAnswers({...qAnswers, q3: e.target.value})}
              required
            />

            <div className="pt-4">
              <GoldenButton type="submit" className="bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                Final Authorization
              </GoldenButton>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-4 text-center">
          <button 
            onClick={() => {
              setIsDevMode(!isDevMode);
              setShowSecurityCheck(false);
              setEmail('');
              setPassword('');
              setError('');
            }}
            className="flex items-center gap-2 mx-auto text-glowearn-gold/40 hover:text-glowearn-gold text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <ShieldCheck size={14} />
            {isDevMode ? 'Switch to Phone Login' : 'Developer Login'}
          </button>
          
          {!showSecurityCheck && (
            <p className="text-white/40 text-sm">
              New to GlowEarn?{" "}
              <button 
                onClick={() => router.push('/auth/signup')}
                className="text-glowearn-gold font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
