'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, CheckCircle2, Loader2, Send, ShieldCheck, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldenInput } from '@/components/ui/GoldenInput';
import { GoldenButton } from '@/components/ui/GoldenButton';
import { Progress } from "@/components/ui/progress";
import { useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, increment, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

// --- Payment Method Logos ---

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

const EasyPaisaLogo = () => (
  <div className="w-14 h-14 rounded-full bg-black/90 flex items-center justify-center border border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)] relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-400 opacity-40"></div>
    <div className="relative flex items-center justify-center">
      <span className="text-white font-black text-xl italic tracking-tighter drop-shadow-md">EP</span>
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

interface WithdrawalMethod {
  name: string;
  label: string;
  Logo: React.FC;
  inputLabel: string;
  placeholder: string;
  region: 'PK' | 'INT' | 'ALL';
}

export default function WalletPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [coinsInput, setCoinsInput] = useState<string>("0");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [step, setStep] = useState<Step>('selection');
  const [withdrawalDetail, setWithdrawalDetail] = useState<string>('');

  const AD_THRESHOLD = 1500;
  const CONVERSION_RATE = 0.50; // $0.50 per 1000 coins

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (session) {
      setSessionUser(JSON.parse(session));
    }
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!firestore || !sessionUser?.id) return null;
    return doc(firestore, 'users', sessionUser.id);
  }, [firestore, sessionUser?.id]);

  const { data: userData } = useDoc(userRef);

  const isAdmin = userData?.isAdmin || userData?.email === 'developerge@gmail.com' || sessionUser?.isAdmin || sessionUser?.email === 'developerge@gmail.com';
  const isPakistan = userData?.mobile?.startsWith('+92') || sessionUser?.mobile?.startsWith('+92');

  const withdrawalMethods: WithdrawalMethod[] = [
    { name: "JazzCash", label: "(Local Wallet)", Logo: JazzCashLogo, inputLabel: "JazzCash Number", placeholder: "03XX XXXXXXX", region: 'PK' },
    { name: "EasyPaisa", label: "(Local Wallet)", Logo: EasyPaisaLogo, inputLabel: "EasyPaisa Number", placeholder: "03XX XXXXXXX", region: 'PK' },
    { name: "Binance", label: "(USDT/Crypto)", Logo: BinanceLogo, inputLabel: "Binance Pay ID / Email", placeholder: "Enter ID or Email", region: 'INT' },
    { name: "Bitcoin", label: "(BTC/Crypto)", Logo: BitcoinLogo, inputLabel: "Bitcoin Wallet Address", placeholder: "1A1zP1eP...", region: 'INT' },
  ];

  const filteredMethods = useMemo(() => {
    if (isAdmin) return withdrawalMethods;
    return withdrawalMethods.filter(m => isPakistan ? m.region === 'PK' : m.region === 'INT');
  }, [isAdmin, isPakistan]);

  // Handle initial method selection
  useEffect(() => {
    if (filteredMethods.length > 0 && !selectedMethod) {
      setSelectedMethod(filteredMethods[0].name);
    }
  }, [filteredMethods, selectedMethod]);

  const activeMethod = useMemo(() => 
    withdrawalMethods.find(m => m.name === selectedMethod) || withdrawalMethods[0]
  , [selectedMethod]);

  const actualBalance = userData?.coins ?? 0;
  const adsWatched = userData?.adsWatched ?? 0;
  
  const rawInputCoins = Number(coinsInput.replace(/,/g, ''));
  const usdValue = ((rawInputCoins / 1000) * CONVERSION_RATE).toFixed(2);
  
  const isAdsMet = adsWatched >= AD_THRESHOLD;
  const hasEnoughCoins = rawInputCoins <= actualBalance;
  const hasMinCoins = rawInputCoins >= 1000;
  const canWithdraw = isAdmin || (isAdsMet && hasEnoughCoins && hasMinCoins);

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCoinsInput(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const handleProceedToDetails = () => {
    if (actualBalance < rawInputCoins && !isAdmin) {
      toast({
        title: "Insufficient Balance!",
        description: "You cannot withdraw more than your current balance.",
        variant: "destructive",
      });
      return;
    }
    setStep('details');
  };

  const handleSubmitRequest = () => {
    if (!withdrawalDetail || !userRef || !firestore || !sessionUser) return;
    
    if (actualBalance < rawInputCoins && !isAdmin) {
       toast({
        title: "Insufficient Balance!",
        description: "Transaction failed. Please check your coin balance.",
        variant: "destructive",
      });
      setStep('selection');
      return;
    }

    setStep('processing');
    
    const withdrawRequestsRef = collection(firestore, 'WithdrawRequests');
    const requestData = {
      userId: sessionUser.id,
      username: userData?.name || sessionUser.name,
      amountCoins: rawInputCoins,
      amountUSD: Number(usdValue),
      netPayout: Number(usdValue) * 0.95,
      method: selectedMethod,
      details: withdrawalDetail,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    addDocumentNonBlocking(withdrawRequestsRef, requestData);

    if (!isAdmin) {
      // Ensuring it never goes negative by using Math.max logic in UI and strict increment subtraction
      updateDocumentNonBlocking(userRef, { 
        coins: increment(-rawInputCoins),
        usd: increment(-(Number(usdValue)))
      });
    }

    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  if (!sessionUser) return null;

  return (
    <div className="relative min-h-screen pb-24 pt-20 bg-glowearn-navy">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center">
        {step === 'selection' && (
          <>
            <section className="w-full text-center space-y-1 mt-4">
              <h3 className="text-glowearn-gold/60 font-bold uppercase tracking-[0.2em] text-[10px]">Vault Balance</h3>
              <div className="space-y-0.5">
                <h1 className="text-glowearn-gold font-headline font-black text-3xl uppercase tracking-tighter">
                  USD: <span className="italic">${((actualBalance / 1000) * CONVERSION_RATE).toFixed(2)}</span>
                </h1>
                <p className="text-white/40 font-bold text-xs uppercase">{actualBalance.toLocaleString()} Coins Available</p>
              </div>
            </section>

            {isAdmin && (
              <div className="w-full bg-glowearn-gold/10 border border-glowearn-gold/30 p-4 rounded-3xl flex items-center gap-3">
                <ShieldCheck className="text-glowearn-gold shrink-0" size={24} />
                <div className="flex-1">
                  <p className="text-white font-black text-[10px] uppercase tracking-tighter">Testing Mode Active</p>
                  <p className="text-glowearn-gold/80 text-[9px] font-bold uppercase">All restrictions bypassed for Developer.</p>
                </div>
              </div>
            )}

            {!isAdmin && (
              <Card className="w-full bg-[#0c2436]/40 border border-glowearn-gold/20 rounded-3xl p-5 shadow-2xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/60 flex items-center gap-2">
                      <PlayCircle size={14} className="text-glowearn-gold" /> Verification Progress
                    </span>
                    <span className={cn(isAdsMet ? "text-green-400" : "text-glowearn-gold")}>
                      {adsWatched} / {AD_THRESHOLD}
                    </span>
                  </div>
                  <Progress 
                    value={(adsWatched / AD_THRESHOLD) * 100} 
                    className="h-2.5 bg-black/40 [&>div]:bg-glowearn-gold" 
                  />
                  <p className="text-[9px] text-white/40 font-bold uppercase text-center italic">
                    {isAdsMet ? "✓ Verification Complete" : "Watch 1500 ads to unlock conversion."}
                  </p>
                </div>
              </Card>
            )}

            <div className="w-full grid grid-cols-2 gap-3">
              {filteredMethods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method.name)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 backdrop-blur-md",
                    selectedMethod === method.name 
                      ? "bg-glowearn-gold/20 border-glowearn-gold shadow-[0_0_20px_rgba(250,219,59,0.2)]" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <method.Logo />
                  <span className="mt-2 text-white font-black text-[10px] uppercase tracking-widest">{method.name}</span>
                </button>
              ))}
            </div>

            <Card className={cn(
              "w-full bg-black/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md border-2 transition-all duration-500",
              canWithdraw ? "border-glowearn-gold shadow-[0_0_40px_rgba(250,219,59,0.1)]" : "border-white/10"
            )}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-glowearn-gold/60 font-bold uppercase tracking-widest text-[10px] px-1">Redeem Amount</label>
                  <div className="relative flex items-center gap-4 bg-[#081926] p-5 rounded-2xl border border-white/5">
                    <input 
                      type="text" 
                      value={coinsInput}
                      onChange={handleCoinChange}
                      className="bg-transparent text-white font-black text-3xl w-full focus:outline-none placeholder:text-white/20 text-center"
                      placeholder="0"
                    />
                  </div>
                  {!hasEnoughCoins && !isAdmin && (
                    <p className="text-red-500 text-[10px] font-black uppercase text-center mt-2 flex items-center justify-center gap-1">
                      <AlertCircle size={12} /> Insufficient Balance!
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center py-2 relative">
                  <div className={cn(
                    "px-8 py-5 rounded-[2rem] border flex flex-col items-center w-full text-center relative transition-all duration-300",
                    canWithdraw ? "bg-glowearn-gold/10 border-glowearn-gold/30" : "bg-white/5 border-white/5"
                  )}>
                    <span className={cn(
                      "font-headline font-black text-2xl italic tracking-tighter block",
                      canWithdraw ? "text-glowearn-gold" : "text-white/20"
                    )}>
                      ${usdValue} USD
                    </span>
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Est. Payout Value</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <GoldenButton 
              disabled={!canWithdraw || rawInputCoins < 1000}
              onClick={handleProceedToDetails}
              className={!canWithdraw || rawInputCoins < 1000 ? "opacity-30 grayscale" : ""}
            >
              {isAdmin ? 'TEST CONVERT' : (rawInputCoins < 1000 ? 'MIN 1000 COINS' : 'PROCEED TO DETAILS')}
            </GoldenButton>
          </>
        )}

        {step === 'details' && (
          <div className="w-full space-y-8 mt-4 animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setStep('selection')}
              className="flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest"
            >
              <ChevronLeft size={16} /> Change Method
            </button>

            <header className="text-center">
              <h1 className="text-white font-headline text-3xl font-black uppercase italic tracking-tighter">Confirm <span className="text-glowearn-gold">Payout</span></h1>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Final review of your request</p>
            </header>

            <Card className="bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <activeMethod.Logo />
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-tight">{activeMethod.name}</h4>
                      <p className="text-glowearn-gold font-bold text-[9px] uppercase tracking-widest">{activeMethod.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-white font-black text-xl italic">${usdValue}</span>
                    <span className="text-white/40 text-[8px] font-bold uppercase">Amount</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-white/40">Fee (5%)</span>
                    <span className="text-red-400">-${(Number(usdValue) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-glowearn-gold/10 rounded-2xl border border-glowearn-gold/20">
                    <span className="text-glowearn-gold font-black text-xs uppercase tracking-widest">Net Payout</span>
                    <span className="text-white font-black text-2xl italic">${(Number(usdValue) * 0.95).toFixed(2)}</span>
                  </div>
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
              <GoldenButton 
                onClick={handleSubmitRequest}
                disabled={!withdrawalDetail}
                className={!withdrawalDetail ? "opacity-50" : ""}
              >
                REQUEST WITHDRAWAL
              </GoldenButton>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center animate-in fade-in">
            <Loader2 className="text-glowearn-gold animate-spin" size={80} strokeWidth={1} />
            <h2 className="text-white font-headline text-2xl font-black uppercase tracking-widest">Validating Chain...</h2>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center animate-in zoom-in px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-glowearn-gold blur-2xl opacity-20 animate-pulse"></div>
              <CheckCircle2 className="text-glowearn-gold relative z-10" size={100} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h2 className="text-white font-headline text-3xl font-black uppercase italic tracking-tighter">Request <span className="text-glowearn-gold">Secured!</span></h2>
              <p className="text-white/40 font-bold text-xs leading-relaxed uppercase tracking-widest">
                Transfer pending verification.<br />Expected arrival: 24-72 hours.
              </p>
            </div>
            <button 
              onClick={() => {
                setStep('selection');
                setWithdrawalDetail('');
                setCoinsInput('0');
              }} 
              className="text-glowearn-gold font-black uppercase tracking-widest text-[10px] border-b border-glowearn-gold/30 pb-1"
            >
              Return to Vault
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
