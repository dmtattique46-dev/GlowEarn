
"use client"

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Lock, Smartphone, Bitcoin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  const [coins, setCoins] = useState<string>("50,000");
  const [selectedMethod, setSelectedMethod] = useState<string>("Binance");

  // Conversion logic: 50,000 Coins = $1 USD
  const usdValue = (Number(coins.replace(/,/g, '')) / 50000).toFixed(2);
  const isTargetValue = coins.replace(/,/g, '') === "50000";

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCoins(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const withdrawalMethods = [
    { name: "Binance", label: "(Crypto)", icon: CircleDollarSign },
    { name: "JazzCash", label: "(Mobile Wallet)", icon: Smartphone },
    { name: "Bitcoin", label: "(Crypto)", icon: Bitcoin },
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
              <div className="bg-glowearn-gold/20 p-2 rounded-full">
                <CircleDollarSign className="text-glowearn-gold" size={32} />
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

              {isTargetValue && (
                <div className="absolute -right-4 bottom-4 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-glowearn-gold shadow-[0_0_10px_#fadb3b]" />
                </div>
              )}
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
                    "flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm",
                    isSelected 
                      ? "bg-glowearn-gold/10 border-glowearn-gold/80 shadow-[0_0_15px_#fadb3b33]" 
                      : "bg-[#0c2436]/60 border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <method.icon className={cn("mb-2", isSelected ? "text-glowearn-gold" : "text-white/60")} size={28} />
                  <span className={cn("text-[10px] font-black uppercase", isSelected ? "text-white" : "text-white/40")}>
                    {method.name}
                  </span>
                  <span className="text-[7px] text-white/30 uppercase font-bold">{method.label}</span>
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
