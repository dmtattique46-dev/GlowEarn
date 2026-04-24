"use client"

import React from 'react';
import { Settings, CircleDollarSign } from 'lucide-react';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Coins */}
      <div className="absolute top-[20%] left-[5%] float opacity-20 text-[#FADB3B]">
        <CircleDollarSign size={80} />
      </div>
      <div className="absolute bottom-[25%] right-[10%] float opacity-15 text-[#FADB3B]" style={{ animationDelay: '2s' }}>
        <CircleDollarSign size={120} />
      </div>
      <div className="absolute top-[60%] left-[15%] float opacity-10 text-[#FADB3B]" style={{ animationDelay: '4s' }}>
        <CircleDollarSign size={60} />
      </div>

      {/* Gears */}
      <div className="absolute top-[10%] right-[15%] gear-spin opacity-10 text-[#FADB3B]">
        <Settings size={150} />
      </div>
      <div className="absolute bottom-[10%] left-[8%] gear-spin opacity-20 text-[#FADB3B]" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
        <Settings size={100} />
      </div>
      <div className="absolute top-[40%] right-[5%] gear-spin opacity-15 text-[#FADB3B]" style={{ animationDuration: '20s' }}>
        <Settings size={80} />
      </div>
    </div>
  );
}
