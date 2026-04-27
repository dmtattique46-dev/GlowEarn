
"use client"

import React, { useState, useMemo } from 'react';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Phone, Mail, Lock, AlertCircle, ShieldCheck, ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Comprehensive Country List with Dialing Codes and Flags
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
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === "Pakistan") || COUNTRIES[0]);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isDevMode) {
      if (email === 'developerge@gmail.com' && password === '123456') {
        const devUser = {
          id: 'dev-001',
          name: 'Developer Admin',
          email: 'developerge@gmail.com',
          isAdmin: true,
          isPlayer: false,
          balance: 99999.99,
          points: 99999,
        };
        localStorage.setItem('glowearn_current_user', JSON.stringify(devUser));
        toast({ title: "Master Access Granted", description: "Logged in as System Developer." });
        router.push('/');
      } else {
        setError('Only developer can use this feature.');
      }
      return;
    }

    // Regular Phone Login
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    const fullNumber = selectedCountry.code + mobile;
    const user = users.find((u: any) => u.mobile === fullNumber);

    if (user) {
      localStorage.setItem('glowearn_current_user', JSON.stringify({ ...user, isPlayer: true, isAdmin: false }));
      toast({ title: "Welcome Back!", description: "Successfully logged in via mobile." });
      router.push('/');
    } else {
      setError('Number not found! Please sign up first.');
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 bg-glowearn-navy">
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

          {!isDevMode ? (
            <div className="space-y-4">
              <label className="text-glowearn-gold/80 text-xs font-bold uppercase tracking-widest px-1">Country & Mobile</label>
              <div className="flex gap-2">
                <Select 
                  onValueChange={(val) => setSelectedCountry(COUNTRIES.find(c => c.name === val) || COUNTRIES[0])}
                  defaultValue={selectedCountry.name}
                >
                  <SelectTrigger className="w-[110px] bg-glowearn-navy/50 border-glowearn-gold/30 rounded-2xl h-[58px] text-white focus:ring-glowearn-gold">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span className="text-sm font-bold">{selectedCountry.code}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-glowearn-navy border-glowearn-gold/30 text-white max-h-[300px]">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.name} value={c.name} className="hover:bg-glowearn-gold/10 focus:bg-glowearn-gold/10">
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
              {isDevMode ? 'Authorize Access' : 'Log In Now'}
            </GoldenButton>
          </div>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <button 
            onClick={() => setIsDevMode(!isDevMode)}
            className="flex items-center gap-2 mx-auto text-glowearn-gold/40 hover:text-glowearn-gold text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <ShieldCheck size={14} />
            {isDevMode ? 'Switch to Phone Login' : 'Developer Login'}
          </button>
          
          <p className="text-white/40 text-sm">
            New to GlowEarn?{" "}
            <button 
              onClick={() => router.push('/auth/signup')}
              className="text-glowearn-gold font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
