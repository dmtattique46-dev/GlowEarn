
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Unlock, ArrowRight, AlertCircle, ChevronLeft, CheckCircle2, Loader2, Send, ShieldCheck, Clock, ShieldAlert, Users, DollarSign, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const BinanceLogo = () => (
  <div className="w-14 h-14 rounded-full bg-black/90 flex items-center justify-center border border-yellow-500/40 shadow-[0_0_15px_rgba(243,186,47,0.3)]">
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#F3BA2F]">
      <path d="M16.624 13.9202L12 18.5442L7.376 13.9202L5.992 15.3042L12 21.3122L18.008 15.3042L16.624 13.9202Z" />
      <path d="M12 15.1522L8.848 12.0002L12 8.8482L15.152 12.0002L12 15.1522Z" />
      <path d="M7.376 10.0802L12 5.45617L16.624 10.0802L18.008 8.69617L12 2.68817L5.992 8.69617L7.376 10.0802Z" />
      <path d="M2.688 12.0002L5.456 9.23217L8.224 12.0002L5.456 14.7682L2.688 12.0002Z" />
      <path d="M15.776 12.0002L18.544 9.23217L21.312 12.0002L18.544 14.7682L15.776 12.0002Z" />
    </svg>
  </div>
);

const JazzCashLogo = () => (
  <div className="w-14 h-14 rounded-full bg-black/90 flex items-center justify-center border border-red-500/40 shadow-[0_0_15px_rgba(237,28,36,0.3)] relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#ED1C24] to-[#FADB3B] opacity-40"></div>
    <div className="relative flex items-center justify-center">
      <span className="text-white font-black text-xl italic tracking-tighter drop-shadow-md">JC</span>
    </div>
  </div>
);

const BitcoinLogo = () => (
  <div className="w-14 h-14 rounded-full bg-black/90 flex items-center justify-center border border-orange-500/40 shadow-[0_0_15px_rgba(247,147,26,0.3)]">
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#F7931A]">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.696 8.472-1.213 14.9.392c6.435 1.602 10.342 8.113 8.738 14.512zm-4.145-5.915c.315-2.106-1.29-3.24-3.48-3.99l.713-2.856-1.738-.433-.695 2.785c-.456-.113-.923-.22-1.387-.325l.7-2.813-1.738-.433-.713 2.856c-.378-.087-.75-.175-1.11-.267l.002-.012-2.397-.598-.462 1.856s1.29.295 1.263.313c.704.176.83.645.81.1017l-.81 3.255c.048.012.11.03.18.057l-.183-.045-1.135 4.557c-.086.212-.305.531-.797.408.018.027-1.263-.315-1.263-.315l-.862 1.987 2.26.564c.42.105.83.213 1.232.315l-.72 2.888 1.737.433.713-2.856c.475.13.935.25 1.382.366l-.713 2.856 1.738.433.72-2.897c2.964.56 5.192.334 6.13-2.345.755-2.157-.037-3.402-1.597-4.212 1.135-.262 1.99-.101 2.226-2.584zm-3.977 5.64c-.538 2.16-4.184 1-5.367.705l.958-3.84c1.183.295 4.965.875 4.41 3.135zm.54-5.67c-.49 1.965-3.53.967-4.516.72l.87-3.484c.985.245 4.148.7 3.646 2.764z" />
    </svg>
  </div>
);

type Step = 'selection' | 'details' | 'processing' | 'success';

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [coinsInput, setCoinsInput] = useState<string>("0");
  const [selectedMethod, setSelectedMethod] = useState<string>("JazzCash");
  const [step, setStep] = useState<Step>('selection');
  const [withdrawalDetail, setWithdrawalDetail] = useState<string>('');

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const withdrawalMethods = [
    { name: "JazzCash", label: "(Mobile Wallet)", Logo: JazzCashLogo, rate: 85000, inputLabel: "Enter JazzCash Mobile Number", placeholder: "+92 3XX XXXXXXX" },
    { name: "Bitcoin", label: "(Crypto)", Logo: BitcoinLogo, rate: 60000, inputLabel: "Enter Bitcoin Wallet Address", placeholder: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    { name: "Binance", label: "(Crypto)", Logo: BinanceLogo, rate: 150000, inputLabel: "Enter Binance Pay ID / Email", placeholder: "ID or Email" },
  ];

  const activeMethod = useMemo(() => 
    withdrawalMethods.find(m => m.name === selectedMethod) || withdrawalMethods[0]
  , [selectedMethod]);

  const rawInputCoins = Number(coinsInput.replace(/,/g, ''));
  const usdValue = (rawInputCoins / activeMethod.rate).toFixed(2);
  
  const actualBalance = user?.points || 0;
  const isVerified = user?.emailVerified && user?.phoneVerified;
  const hasMinimumRequired = rawInputCoins >= activeMethod.rate;
  const isWithinBalance = rawInputCoins <= actualBalance;
  const canWithdraw = hasMinimumRequired && isWithinBalance && rawInputCoins > 0 && isVerified;

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCoinsInput(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const handleVerify = () => {
    const verifiedUser = { ...user, emailVerified: true, phoneVerified: true };
    setUser(verifiedUser);
    localStorage.setItem('glowearn_current_user', JSON.stringify(verifiedUser));
    
    // Update main users list for persistence
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = verifiedUser;
      localStorage.setItem('glowearn_users', JSON.stringify(users));
    }
  };

  const handleSubmitRequest = () => {
    if (!withdrawalDetail) return;
    setStep('processing');
    
    setTimeout(() => {
      const updatedUser = { ...user, points: user.points - rawInputCoins };
      setUser(updatedUser);
      localStorage.setItem('glowearn_current_user', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
      const index = users.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('glowearn_users', JSON.stringify(users));
      }
      
      setStep('success');
    }, 2500);
  };

  const handleReset = () => {
    setStep('selection');
    setWithdrawalDetail('');
    setCoinsInput('0');
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen pb-24 pt-20 bg-glowearn-navy">
      <FloatingElements />
      <Header usdBalance={actualBalance / activeMethod.rate} coinCount={actualBalance} />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center">
        {step === 'selection' && (
          <>
            <section className="w-full text-center space-y-1 mt-4">
              <h3 className="text-glowearn-gold/60 font-bold uppercase tracking-[0.2em] text-[10px]">Balance Summary</h3>
              <div className="space-y-0.5">
                <h2 className="text-white/80 font-bold text-lg">AVAILABLE COINS: <span className="text-white font-black italic">{actualBalance.toLocaleString()}</span></h2>
                <h1 className="text-glowearn-gold font-headline font-black text-2xl uppercase tracking-tighter">
                  USD VALUE: <span className="italic">${(actualBalance / activeMethod.rate).toFixed(2)}</span>
                </h1>
              </div>
            </section>

            {/* Verification Status Banner */}
            {!isVerified && (
              <div className="w-full bg-red-500/10 border border-red-500/30 p-4 rounded-3xl flex items-center gap-3 animate-pulse">
                <ShieldAlert className="text-red-500 shrink-0" size={24} />
                <div className="flex-1">
                  <p className="text-white font-black text-[10px] uppercase tracking-tighter leading-none mb-1">Account Not Verified</p>
                  <p className="text-red-400 text-[9px] font-bold uppercase leading-tight">Identity verification required to unlock withdrawal vault.</p>
                </div>
                <button 
                  onClick={handleVerify}
                  className="bg-red-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase shadow-lg active:scale-95 transition-all"
                >
                  Verify Now
                </button>
              </div>
            )}

            <Card className={cn(
              "w-full bg-[#0c2436]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all duration-500",
              canWithdraw ? "neon-gold-border" : "border-white/10"
            )}>
              <CardContent className="p-8 space-y-6">
                <h3 className="text-glowearn-gold/80 font-bold text-center uppercase tracking-widest text-xs">Coin to USD Converter</h3>
                
                <div className="space-y-2">
                  <div className="relative flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="bg-glowearn-gold/10 p-1.5 rounded-full flex items-center justify-center">
                      <activeMethod.Logo />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={coinsInput}
                        onChange={handleCoinChange}
                        className="bg-transparent text-white font-black text-2xl w-full focus:outline-none placeholder:text-white/20"
                        placeholder="0"
                      />
                      <span className="text-[10px] text-white/40 font-bold uppercase block -mt-1">Coins Amount</span>
                    </div>
                  </div>

                  {rawInputCoins > 0 && !hasMinimumRequired && (
                    <div className="flex items-center gap-2 px-2 text-destructive animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        Minimum {activeMethod.rate.toLocaleString()} coins required
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center py-2 relative">
                  <ArrowRight className="text-glowearn-gold opacity-40 rotate-90 mb-4" size={32} />
                  
                  <div className={cn(
                    "px-8 py-4 rounded-3xl border flex flex-col items-center transition-all duration-300 w-full text-center relative overflow-hidden",
                    canWithdraw 
                      ? "bg-glowearn-gold/10 border-glowearn-gold golden-glow" 
                      : "bg-white/5 border-white/10"
                  )}>
                    <span className={cn(
                      "font-black text-3xl italic tracking-tighter block",
                      canWithdraw ? "text-glowearn-gold" : "text-white/40"
                    )}>
                      ${usdValue} USD
                    </span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Est. Withdrawal Value</span>
                    
                    {canWithdraw && (
                      <div className="absolute top-1 right-2">
                        <CheckCircle2 size={16} className="text-glowearn-gold" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Rules & Privacy Policy Accordion */}
            <section className="w-full">
              <Accordion type="single" collapsible className="w-full space-y-3">
                <AccordionItem value="policy" className="border-none bg-[#0c2436]/40 rounded-[2rem] px-5 border border-white/5 overflow-hidden">
                  <AccordionTrigger className="hover:no-underline py-5 text-glowearn-gold font-black uppercase text-[11px] tracking-widest">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-glowearn-gold" />
                      Withdrawal Rules & Privacy
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <Clock className="text-glowearn-gold shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-white text-[10px] font-black uppercase tracking-tight">Processing Time</p>
                          <p className="text-white/60 text-[9px] font-bold uppercase mt-1 leading-relaxed">
                            Withdrawal processing takes <span className="text-white">24 to 72 hours</span>. Please be patient while we review.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <ShieldAlert className="text-red-500 shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-white text-[10px] font-black uppercase tracking-tight">Manual Tracking Policy</p>
                          <p className="text-white/60 text-[9px] font-bold uppercase mt-1 leading-relaxed">
                            Hum har transaction ko <span className="text-red-500">manually review</span> karte hain. suspicious activity payi gayi toh payment reject hogi.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <DollarSign className="text-green-500 shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-white text-[10px] font-black uppercase tracking-tight">Fair Play Tax</p>
                          <p className="text-white/60 text-[9px] font-bold uppercase mt-1 leading-relaxed">
                            App maintenance ke liye har withdrawal par <span className="text-green-500">5% processing fee</span> kategi.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <Users className="text-red-500 shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-red-500 text-[10px] font-black uppercase tracking-tight">Permanent Ban Clause</p>
                          <p className="text-white/70 text-[9px] font-bold uppercase mt-1 leading-relaxed">
                            Multiple accounts bana kar ek hi wallet mein withdraw lene par <span className="text-red-500">Permanent Ban</span> hoga.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <button 
              disabled={!canWithdraw}
              onClick={() => setStep('details')}
              className={cn(
                "w-full mt-2 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 transition-all duration-300",
                canWithdraw 
                  ? "shimmer-btn shadow-[0_10px_30px_rgba(250,219,59,0.3)] active:scale-95" 
                  : "bg-white/5 border border-white/10 opacity-30 cursor-not-allowed"
              )}
            >
              <span className={cn(
                "font-headline font-black text-xl uppercase tracking-widest",
                canWithdraw ? "text-glowearn-navy" : "text-white/40"
              )}>
                {isVerified ? 'Confirm Withdrawal' : 'Verification Required'}
              </span>
              {!canWithdraw ? (
                <Lock className="text-white/20" size={24} />
              ) : (
                <Unlock className="text-glowearn-navy" size={24} />
              )}
            </button>
          </>
        )}

        {step === 'details' && (
          <div className="w-full space-y-8 mt-4 animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setStep('selection')}
              className="flex items-center gap-2 text-glowearn-gold/60 hover:text-glowearn-gold font-bold uppercase text-xs"
            >
              <ChevronLeft size={16} /> Back to Vault
            </button>

            <header className="text-center space-y-2">
              <h1 className="text-white font-headline text-3xl font-black uppercase tracking-tight">Final <span className="text-glowearn-gold">Review</span></h1>
              <p className="text-white/40 text-sm">Review your payout and fee deductions</p>
            </header>

            <Card className="bg-glowearn-gold/10 border-glowearn-gold/40 rounded-3xl overflow-hidden backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-glowearn-navy border border-glowearn-gold/20 p-2.5 rounded-2xl shadow-lg">
                      <activeMethod.Logo />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-tight">{activeMethod.name}</h4>
                      <p className="text-white/40 text-[9px] uppercase font-bold">{rawInputCoins.toLocaleString()} Coins Redeemed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-glowearn-gold font-black text-2xl italic">${usdValue}</span>
                    <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">Gross Total</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-glowearn-gold/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-bold text-[10px] uppercase tracking-wider">Maintenance Fee (5%)</span>
                    <span className="text-red-400 font-black text-xs">-${(Number(usdValue) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-glowearn-gold/5 rounded-xl border border-glowearn-gold/10">
                    <span className="text-glowearn-gold font-black text-xs uppercase tracking-widest">Net Payout</span>
                    <span className="text-white font-black text-xl italic">${(Number(usdValue) * 0.95).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[9px] text-white/40 font-bold uppercase leading-tight italic">
                  <Info size={10} className="shrink-0 mt-0.5" />
                  <p>By confirming, you agree to our manual review protocol and 24-72h processing window.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <GoldenInput 
                icon={Send} 
                label={activeMethod.inputLabel} 
                placeholder={activeMethod.placeholder}
                value={withdrawalDetail}
                onChange={(e) => setWithdrawalDetail(e.target.value)}
                required
              />
              <div className="pt-4">
                <GoldenButton 
                  onClick={handleSubmitRequest}
                  disabled={!withdrawalDetail}
                >
                  Confirm & Transfer
                </GoldenButton>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-glowearn-gold/20 animate-ping"></div>
              <Loader2 className="text-glowearn-gold animate-spin relative z-10" size={100} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h2 className="text-white font-headline text-3xl font-black uppercase tracking-widest">Securing Funds...</h2>
              <p className="text-glowearn-gold/60 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Manual Review Protocol Active</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center animate-in zoom-in duration-500 px-4">
            <div className="bg-glowearn-gold/10 p-8 rounded-full border-2 border-glowearn-gold/30 shadow-[0_0_50px_rgba(250,219,59,0.2)]">
              <CheckCircle2 className="text-glowearn-gold" size={100} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h2 className="text-white font-headline text-4xl font-black uppercase tracking-tighter">Request <span className="text-glowearn-gold">Queued!</span></h2>
              <p className="text-white/70 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
                Your manual review has started. Expected arrival: <span className="text-glowearn-gold">24-72 hours</span>.
              </p>
            </div>
            <button 
              onClick={handleReset} 
              className="text-glowearn-gold font-black uppercase tracking-[0.25em] text-[10px] hover:underline hover:scale-110 transition-transform"
            >
              Return to Wallet
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

