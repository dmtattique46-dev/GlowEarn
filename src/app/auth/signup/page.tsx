
"use client"

import React, { useState, useMemo } from 'react';
import { FloatingElements } from '@/components/background/FloatingElements';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { User, Phone, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
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
  { name: "Pakistan", code: "+92", flag: "🇵🇰", lengths: [10, 11], placeholder: "03XX XXXXXXX" },
  { name: "United States", code: "+1", flag: "🇺🇸", lengths: [10], placeholder: "201 555 0123" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", lengths: [10], placeholder: "7400 123456" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", lengths: [9], placeholder: "50 123 4567" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", lengths: [9], placeholder: "50 123 4567" },
  { name: "India", code: "+91", flag: "🇮🇳", lengths: [10], placeholder: "98765 43210" },
  { name: "Canada", code: "+1", flag: "🇨🇦", lengths: [10], placeholder: "416 555 0123" },
  { name: "Australia", code: "+61", flag: "🇦🇺", lengths: [9], placeholder: "4XX XXX XXX" },
  { name: "Germany", code: "+49", flag: "🇩🇪", lengths: [10, 11], placeholder: "151 XXXX XXXX" },
  { name: "France", code: "+33", flag: "🇫🇷", lengths: [9], placeholder: "6 XX XX XX XX" },
  { name: "Turkey", code: "+90", flag: "🇹🇷", lengths: [10], placeholder: "5XX XXX XX XX" },
  { name: "Qatar", code: "+974", flag: "🇶🇦", lengths: [8], placeholder: "XXXX XXXX" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", lengths: [8], placeholder: "XXXX XXXX" },
  { name: "Oman", code: "+968", flag: "🇴🇲", lengths: [8], placeholder: "XXXX XXXX" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭", lengths: [8], placeholder: "XXXX XXXX" },
  { name: "China", code: "+86", flag: "🇨🇳", lengths: [11], placeholder: "1XX XXXX XXXX" },
  { name: "Japan", code: "+81", flag: "🇯🇵", lengths: [10], placeholder: "XX XXXX XXXX" },
  { name: "South Korea", code: "+82", flag: "🇰🇷", lengths: [10], placeholder: "10 XXXX XXXX" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", lengths: [9, 10], placeholder: "1X XXX XXXX" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", lengths: [8], placeholder: "XXXX XXXX" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", lengths: [10, 11, 12], placeholder: "8XX XXXX XXXX" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", lengths: [10], placeholder: "1XXX XXXXXX" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", lengths: [10], placeholder: "80X XXX XXXX" },
  { name: "South Africa", code: "+27", flag: "🇿🇦", lengths: [9], placeholder: "XX XXX XXXX" },
  { name: "Brazil", code: "+55", flag: "🇧🇷", lengths: [11], placeholder: "XX 9XXXX XXXX" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDevMode, setIsDevMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === "Pakistan") || COUNTRIES[0]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const isPhoneValid = useMemo(() => {
    const digits = formData.mobile.replace(/\D/g, '');
    if (selectedCountry.name === "Pakistan") {
      if (digits.length === 11) return digits.startsWith('0');
      if (digits.length === 10) return !digits.startsWith('0');
      return false;
    }
    return selectedCountry.lengths.includes(digits.length);
  }, [formData.mobile, selectedCountry]);

  const normalizePhone = (num: string, country: typeof selectedCountry) => {
    const digits = num.replace(/\D/g, '');
    if (country.name === "Pakistan") {
      return country.code + digits.replace(/^0/, '');
    }
    return country.code + digits;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isDevMode) {
      if (formData.email === 'developerge@gmail.com' && formData.password === '123456') {
        const devUser = {
          id: 'dev-master-admin',
          name: 'Developer Admin',
          email: 'developerge@gmail.com',
          isAdmin: true,
          isPlayer: false,
          balance: 99999.99,
          points: 99999999,
          xp: 1000000000,
        };
        localStorage.setItem('glowearn_current_user', JSON.stringify(devUser));
        toast({ title: "Master Access Granted", description: "Logged in as System Developer." });
        router.push('/');
      } else {
        setError('Unauthorized: Only developer can use this feature.');
      }
      return;
    }

    if (!isPhoneValid) {
      setError(`Invalid number length for ${selectedCountry.name}`);
      return;
    }

    const fullNumber = normalizePhone(formData.mobile, selectedCountry);
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    
    const exists = users.find((u: any) => u.mobile === fullNumber);
    if (exists) {
      setError('This number already exists! Please login instead.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      mobile: fullNumber,
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
          <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
            Join GlowEarn
          </h1>
          <p className="text-white/60 text-sm mt-2">Start your journey to premium earnings</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          {!isDevMode ? (
            <div className="space-y-6 animate-in fade-in">
              <GoldenInput 
                icon={User} 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <div className="space-y-2">
                <label className="text-glowearn-gold/80 text-xs font-bold uppercase tracking-widest px-1">Country & Mobile</label>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={(val) => {
                      setSelectedCountry(COUNTRIES.find(c => c.name === val) || COUNTRIES[0]);
                      setError('');
                    }}
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
                      placeholder={selectedCountry.placeholder} 
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')});
                        setError('');
                      }}
                      required 
                    />
                  </div>
                </div>
                {formData.mobile.length > 0 && !isPhoneValid && !isDevMode && (
                  <p className="text-red-500 text-[10px] font-bold uppercase px-2">
                    Invalid number length for {selectedCountry.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <GoldenInput 
                icon={Mail} 
                label="Admin Email" 
                placeholder="Enter Admin Email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
              <GoldenInput 
                icon={Lock} 
                label="Master Key" 
                placeholder="Enter Master Key" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
          )}

          <div className="pt-4">
            <GoldenButton 
              type="submit" 
              disabled={!isDevMode && formData.mobile.length > 0 && !isPhoneValid}
              className={!isDevMode && formData.mobile.length > 0 && !isPhoneValid ? "opacity-50 grayscale" : ""}
            >
              {isDevMode ? 'Authorize Dev Account' : 'Sign Up Now'}
            </GoldenButton>
          </div>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <button 
            onClick={() => {
              setIsDevMode(!isDevMode);
              setFormData({...formData, email: '', password: ''});
              setError('');
            }}
            className="flex items-center gap-2 mx-auto text-glowearn-gold/40 hover:text-glowearn-gold text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <ShieldCheck size={14} />
            {isDevMode ? 'Switch to Standard Signup' : 'Developer Login'}
          </button>
          
          <p className="text-center text-white/40 text-sm">
            Already have an account?{" "}
            <button 
              onClick={() => router.push('/auth/login')}
              className="text-glowearn-gold font-bold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
