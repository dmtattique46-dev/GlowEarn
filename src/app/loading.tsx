import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#081926] z-[100] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 animate-ping"></div>
        <Loader2 className="text-[#FADB3B] animate-spin" size={64} strokeWidth={1} />
      </div>
      <div className="text-center">
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] italic">GlowEarn</h2>
        <p className="text-yellow-500/60 font-bold uppercase tracking-widest text-[10px] mt-1">Securing Your Gold</p>
      </div>
    </div>
  );
}
