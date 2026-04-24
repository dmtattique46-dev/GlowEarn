
"use client"

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Official-style logos as inline SVG components for precision and premium styling
const BinanceLogo = () => (
  <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_15px_rgba(243,186,47,0.4)] transition-all group-hover:shadow-[0_0_25px_rgba(243,186,47,0.6)]">
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#F3BA2F]">
      <path d="M12 3L9.06 5.94L12 8.88L14.94 5.94L12 3ZM18.06 9L15.12 11.94L18.06 14.88L21 11.94L18.06 9ZM12 15.12L9.06 18.06L12 21L14.94 18.06L12 15.12ZM5.94 9L3 11.94L5.94 14.88L8.88 11.94L5.94 9ZM12 9.06L9.06 12L12 14.94L14.94 12L12 9.06Z" />
    </svg>
  </div>
);

const JazzCashLogo = () => (
  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(237,28,36,0.4)] transition-all group-hover:shadow-[0_0_25px_rgba(237,28,36,0.6)] overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-9 h-9">
      <rect width="100" height="100" fill="#FFD700" />
      <path d="M25 25 H45 V55 Q45 70 30 70 H15 V55 H30 V25 Z" fill="#ED1C24" />
      <path d="M55 70 H80 V55 H60 V45 H80 V30 H60 V20 H55 V70 Z" fill="#ED1C24" />
    </svg>
  </div>
);

const BitcoinLogo = () => (
  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(247,147,26,0.4)] transition-all group-hover:shadow-[0_0_25px_rgba(247,147,26,0.6)]">
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#F7931A]">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.556.358 9.126 1.96 2.696 8.472-1.213 14.9.392c6.435 1.602 10.342 8.113 8.738 14.512zm-4.145-5.915c.315-2.106-1.29-3.24-3.48-3.99l.713-2.856-1.738-.433-.695 2.785c-.456-.113-.923-.22-1.387-.325l.7-2.813-1.738-.433-.713 2.856c-.378-.087-.75-.175-1.11-.267l.002-.012-2.397-.598-.462 1.856s1.29.295 1.263.313c.704.176.83.645.81.1017l-.81 3.255c.048.012.11.03.18.057l-.183-.045-1.135 4.557c-.086.212-.305.531-.797.408.018.027-1.263-.315-1.263-.315l-.862 1.987 2.26.564c.42.105.83.213 1.232.315l-.72 2.888 1.737.433.713-2.856c.475.13.935.25 1.382.366l-.713 2.856 1.738.433.72-2.897c2.964.56 5.192.334 6.13-2.345.755-2.157-.037-3.402-1.597-4.212 1.135-.262 1.99-.101 2.226-2.584zm-3.977 5.64c-.538 2.16-4.184 1-5.367.705l.958-3.84c1.183.295 4.965.875 4.41 3.135zm.54-5.67c-.49 1.965-3.53.967-4.516.72l.87-3.484c.985.245 4.148.7 3.646 2.764z" />
    </svg>
  </div>
);

export default function WalletPage() {
  const [coins, setCoins] = useState<string>("50,000");
  const [selectedMethod, setSelectedMethod] = useState<string>("Binance");

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCoins(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const rawCoins = Number(coins.replace(/,/g, ''));
  const usdValue = (rawCoins / 50000).toFixed(2);
  const isTargetValue = rawCoins === 50000;

  const withdrawalMethods = [
    { name: "Binance", label: "(Crypto)", Logo: BinanceLogo },
    { name: "JazzCash", label: "(Mobile Wallet)", Logo: JazzCashLogo },
    { name: "Bitcoin", label: "(Crypto)", Logo: BitcoinLogo },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-20 bg-[#081926]">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center">
        {/* Balance Summary Section */}
        <section className="w-full text-center space-y-1 mt-4">
          <h3 className="text-glowearn-gold/60 font-bold uppercase tracking-[0.2em] text-[10px]">Balance Summary</h3>
          <div className="space-y-0.5">
            <h2 className="text-white/80 font-bold text-lg">AVAILABLE COINS: <span className="text-white font-black italic">12,500</span></h2>
            <h1 className="text-glowearn-gold font-headline font-black text-2xl uppercase tracking-tighter">
              USD VALUE: <span className="italic">$0.25</span>
            </h1>
          </div>
        </section>

        {/* Coin to USD Converter */}
        <Card className={cn(
          "w-full bg-[#0c2436]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all duration-500",
          isTargetValue ? "neon-gold-border scale-105" : "border-white/10"
        )}>
          <CardContent className="p-8 space-y-6">
            <h3 className="text-glowearn-gold/80 font-bold text-center uppercase tracking-widest text-xs">Coin to USD Converter</h3>
            
            <div className="relative flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="bg-glowearn-gold/20 p-1.5 rounded-full">
                <BitcoinLogo />
              </div>
              <input 
                type="text" 
                value={coins}
                onChange={handleCoinChange}
                className="bg-transparent text-white font-black text-2xl w-full focus:outline-none placeholder:text-white/20"
                placeholder="Enter Coins"
              />
            </div>

            <div className="flex flex-col items-center justify-center py-2 relative">
              <ArrowRight className="text-glowearn-gold opacity-40 rotate-90 mb-4" size={32} />
              
              <div className={cn(
                "px-8 py-3 rounded-2xl border flex flex-col items-center transition-all duration-300",
                isTargetValue 
                  ? "bg-glowearn-gold/10 border-glowearn-gold shadow-[0_0_20px_#fadb3b55]" 
                  : "bg-white/5 border-white/10"
              )}>
                <span className={cn(
                  "font-black text-2xl italic tracking-tighter",
                  isTargetValue ? "text-glowearn-gold" : "text-white/60"
                )}>
                  ${usdValue} USD
                </span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Conversion Box</span>
              </div>
            </div>

            <p className="text-white/40 text-[9px] text-center font-bold uppercase tracking-tight">
              Conversion complete at standard rate<br />
              (50,000 Coins = $1 USD)
            </p>
          </CardContent>
        </Card>

        {/* Withdrawal Methods */}
        <section className="w-full space-y-4">
          <h3 className="text-glowearn-gold/80 font-bold text-center uppercase tracking-widest text-xs">Withdrawal Methods</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {withdrawalMethods.map((method) => {
              const isSelected = selectedMethod === method.name;
              return (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method.name)}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm group",
                    isSelected 
                      ? "bg-glowearn-gold/10 border-glowearn-gold/80 shadow-[0_0_15px_#fadb3b33]" 
                      : "bg-[#0c2436]/60 border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <div className="mb-4">
                    <method.Logo />
                  </div>
                  <span className={cn("text-[10px] font-black uppercase", isSelected ? "text-white" : "text-white/40")}>
                    {method.name}
                  </span>
                  <span className="text-[7px] text-white/30 uppercase font-bold text-center leading-tight">{method.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Withdraw Button */}
        <button className="w-full mt-4 shimmer-btn rounded-2xl py-5 px-6 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(250,219,59,0.2)] active:scale-95 transition-transform group">
          <span className="text-glowearn-navy font-headline font-black text-xl uppercase tracking-widest">Withdraw Funds</span>
          <Lock className="text-glowearn-navy group-hover:animate-bounce" size={24} />
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
