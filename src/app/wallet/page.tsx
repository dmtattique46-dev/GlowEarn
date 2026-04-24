
"use client"

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Unlock, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Official-style logos as inline SVG components
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

export default function WalletPage() {
  const [actualBalance] = useState<number>(1000000);
  const [coinsInput, setCoinsInput] = useState<string>("1,000,000");
  const [selectedMethod, setSelectedMethod] = useState<string>("JazzCash");

  const withdrawalMethods = [
    { name: "JazzCash", label: "(Mobile Wallet)", Logo: JazzCashLogo, rate: 85000 },
    { name: "Bitcoin", label: "(Crypto)", Logo: BitcoinLogo, rate: 60000 },
    { name: "Binance", label: "(Crypto)", Logo: BinanceLogo, rate: 150000 },
  ];

  const activeMethod = useMemo(() => 
    withdrawalMethods.find(m => m.name === selectedMethod) || withdrawalMethods[0]
  , [selectedMethod]);

  const rawInputCoins = Number(coinsInput.replace(/,/g, ''));
  const usdValue = (rawInputCoins / activeMethod.rate).toFixed(2);
  
  // Logical conditions for button unlock
  const hasMinimumRequired = rawInputCoins >= activeMethod.rate;
  const isWithinBalance = rawInputCoins <= actualBalance;
  const canWithdraw = hasMinimumRequired && isWithinBalance;

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCoinsInput(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  return (
    <div className="relative min-h-screen pb-24 pt-20 bg-glowearn-navy">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center">
        {/* Balance Summary Section */}
        <section className="w-full text-center space-y-1 mt-4">
          <h3 className="text-glowearn-gold/60 font-bold uppercase tracking-[0.2em] text-[10px]">Balance Summary</h3>
          <div className="space-y-0.5">
            <h2 className="text-white/80 font-bold text-lg">AVAILABLE COINS: <span className="text-white font-black italic">{actualBalance.toLocaleString()}</span></h2>
            <h1 className="text-glowearn-gold font-headline font-black text-2xl uppercase tracking-tighter">
              USD VALUE: <span className="italic">${(actualBalance / activeMethod.rate).toFixed(2)}</span>
            </h1>
          </div>
        </section>

        {/* Coin to USD Converter */}
        <Card className={cn(
          "w-full bg-[#0c2436]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all duration-500",
          hasMinimumRequired ? "neon-gold-border" : "border-white/10"
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
                    placeholder="Enter Coins"
                  />
                  <span className="text-[10px] text-white/40 font-bold uppercase block -mt-1">Coins Amount</span>
                </div>
              </div>

              {!hasMinimumRequired && (
                <div className="flex items-center gap-2 px-2 text-destructive animate-pulse">
                  <AlertCircle size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    Minimum {activeMethod.rate.toLocaleString()} coins required for {selectedMethod}
                  </span>
                </div>
              )}
              {hasMinimumRequired && !isWithinBalance && (
                <div className="flex items-center gap-2 px-2 text-red-400">
                  <AlertCircle size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    Insufficient Balance in Account
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center py-2 relative">
              <ArrowRight className="text-glowearn-gold opacity-40 rotate-90 mb-4" size={32} />
              
              <div className={cn(
                "px-8 py-3 rounded-2xl border flex flex-col items-center transition-all duration-300",
                canWithdraw 
                  ? "bg-glowearn-gold/10 border-glowearn-gold golden-glow" 
                  : "bg-white/5 border-white/10"
              )}>
                <span className={cn(
                  "font-black text-2xl italic tracking-tighter",
                  canWithdraw ? "text-glowearn-gold" : "text-white/60"
                )}>
                  ${usdValue} USD
                </span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Withdrawal Value</span>
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded-xl text-center">
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-tight leading-relaxed">
                Standard rate for {selectedMethod}<br />
                ({activeMethod.rate.toLocaleString()} Coins = $1 USD)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Methods */}
        <section className="w-full space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-glowearn-gold/80 font-bold uppercase tracking-widest text-xs">Withdrawal Methods</h3>
            <span className="text-[9px] text-white/40 font-bold uppercase">Select One</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {withdrawalMethods.map((method) => {
              const isSelected = selectedMethod === method.name;
              return (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method.name)}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-2xl border transition-all duration-500 backdrop-blur-sm group h-36 relative overflow-hidden",
                    isSelected 
                      ? "bg-glowearn-gold/15 border-glowearn-gold/80 shadow-[0_0_20px_rgba(250,219,59,0.2)]" 
                      : "bg-[#0c2436]/80 border-white/10 opacity-60 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 hover:border-glowearn-gold/30"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-glowearn-gold shadow-[0_0_8px_#fadb3b]"></div>
                    </div>
                  )}
                  <div className="mb-4">
                    <method.Logo />
                  </div>
                  <span className={cn("text-[10px] font-black uppercase mt-auto", isSelected ? "text-white" : "text-white/40")}>
                    {method.name}
                  </span>
                  <span className="text-[7px] text-white/30 uppercase font-bold text-center leading-tight">{method.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Withdraw Button */}
        <button 
          disabled={!canWithdraw}
          className={cn(
            "w-full mt-4 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 transition-all duration-300 group",
            canWithdraw 
              ? "shimmer-btn shadow-[0_10px_30px_rgba(250,219,59,0.3)] active:scale-95" 
              : "bg-white/5 border border-white/10 opacity-30 cursor-not-allowed"
          )}
        >
          <span className={cn(
            "font-headline font-black text-xl uppercase tracking-widest",
            canWithdraw ? "text-glowearn-navy" : "text-white/40"
          )}>
            Withdraw Funds
          </span>
          {!canWithdraw ? (
            <Lock className="text-white/20" size={24} />
          ) : (
            <Unlock className="text-glowearn-navy" size={24} />
          )}
        </button>

        <p className="text-[10px] text-white/30 font-bold uppercase text-center mt-2 px-4 leading-relaxed">
          Withdrawals are processed within 24-48 hours. Please ensure your wallet address is correct.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

