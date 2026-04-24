
"use client"

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Sparkles, Zap, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game Constants
const GRID_ROWS = 8;
const GRID_COLS = 6;

type BlockColor = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow' | null;

export default function EarnPage() {
  const [grid, setGrid] = useState<BlockColor[][]>(
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null))
  );
  const [score, setScore] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [lastClearRow, setLastClearRow] = useState<number | null>(null);

  // Initial dummy state to match image
  useEffect(() => {
    const newGrid = [...grid];
    // Top blocks
    newGrid[0][0] = 'red'; newGrid[0][1] = 'green';
    newGrid[1][0] = 'red'; newGrid[1][1] = 'green';
    
    // Bottom blocks
    newGrid[4][0] = 'blue'; newGrid[4][1] = 'blue'; newGrid[4][2] = 'purple'; newGrid[4][3] = 'purple';
    newGrid[5][0] = 'blue'; newGrid[5][1] = 'blue'; newGrid[5][2] = 'purple'; newGrid[5][3] = 'purple';
    newGrid[5][4] = 'green';
    newGrid[6][0] = 'red'; newGrid[6][1] = 'red'; newGrid[6][2] = 'red'; newGrid[6][3] = 'red'; newGrid[6][4] = 'green'; newGrid[6][5] = 'orange';
    newGrid[7][0] = 'red'; newGrid[7][1] = 'orange'; newGrid[7][2] = 'orange'; newGrid[7][3] = 'yellow'; newGrid[7][4] = 'yellow'; newGrid[7][5] = 'blue';
    
    setGrid(newGrid);
  }, []);

  const handlePlaceBlock = () => {
    // Simulate a line clear for demonstration
    setLastClearRow(3);
    setShowClear(true);
    setScore(prev => prev + 100);
    setTimeout(() => setShowClear(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-10 left-4 text-glowearn-gold/40 rotate-12">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[spin_20s_linear_infinite]">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-6 text-glowearn-gold/30 -rotate-45">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[spin_15s_linear_infinite_reverse]">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
      
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto flex flex-col items-center">
        {/* Daily Bonus Banner */}
        <div className="w-full mt-4 mb-6">
          <div className="bg-black/40 border border-glowearn-gold/40 rounded-2xl py-3 px-4 flex items-center justify-between shadow-[0_0_15px_rgba(250,219,59,0.1)]">
            <p className="text-[11px] font-black uppercase tracking-tight text-white">
              DAILY BONUS: <span className="text-glowearn-gold">Play today to earn +500 Coins!</span>
            </p>
            <div className="bg-glowearn-gold/20 p-1 rounded-md">
              <Zap size={12} className="text-glowearn-gold fill-glowearn-gold" />
            </div>
          </div>
        </div>

        {/* Game Board Container */}
        <div className="relative p-2 rounded-3xl bg-blue-900/20 border-[3px] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="grid grid-cols-6 gap-1 bg-glowearn-navy/80 p-1 rounded-xl">
            {grid.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                {row.map((cell, cIdx) => (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    className={cn(
                      "w-12 h-12 rounded-lg transition-all duration-300 relative overflow-hidden",
                      cell ? getBlockStyle(cell) : "bg-white/5 border border-white/5 shadow-inner"
                    )}
                  >
                    {cell && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Line Clear Overlay */}
          {showClear && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in duration-300">
              <div className="bg-glowearn-gold/90 backdrop-blur-md py-4 shadow-[0_0_50px_rgba(250,219,59,0.8)] relative">
                <div className="absolute -top-4 -left-4 text-white animate-pulse">
                  <Sparkles size={24} />
                </div>
                <div className="text-center">
                  <h2 className="text-glowearn-navy font-black text-3xl italic tracking-tighter uppercase leading-none">LINE CLEAR!</h2>
                  <p className="text-glowearn-navy font-black text-xl mt-1 tracking-tight">+100 Points</p>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white animate-pulse delay-75">
                  <Sparkles size={24} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Shelf */}
        <div className="mt-10 w-full flex flex-col items-center">
          <div className="relative w-full h-16 bg-blue-400/30 rounded-t-[2rem] border-t-2 border-blue-300/40 flex items-center justify-around px-4">
            {/* Shape 1 */}
            <div className="flex flex-col gap-0.5 cursor-pointer hover:scale-110 transition-transform">
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-red-600 rounded-sm border border-red-400 shadow-md"></div>
                <div className="w-4 h-4 bg-red-600 rounded-sm border border-red-400 shadow-md"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-4 h-4 bg-red-600 rounded-sm border border-red-400 shadow-md"></div>
              </div>
            </div>

            {/* Shape 2 (Active/Target) */}
            <div 
              className="relative flex flex-col gap-0.5 cursor-pointer hover:scale-110 transition-transform"
              onClick={handlePlaceBlock}
            >
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-orange-500 rounded-sm border border-orange-300 shadow-md"></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-orange-500 rounded-sm border border-orange-300 shadow-md"></div>
                <div className="w-4 h-4 bg-orange-500 rounded-sm border border-orange-300 shadow-md"></div>
                <div className="w-4 h-4 bg-orange-500 rounded-sm border border-orange-300 shadow-md"></div>
              </div>
              {/* Hand Icon Pointer */}
              <div className="absolute -bottom-6 right-0 animate-bounce text-white">
                <MousePointer2 size={28} className="rotate-[135deg] fill-white text-black" />
              </div>
            </div>

            {/* Shape 3 */}
            <div className="flex flex-col gap-0.5 cursor-pointer hover:scale-110 transition-transform">
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm border border-yellow-300 shadow-md"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-sm border border-yellow-300 shadow-md"></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm border border-yellow-300 shadow-md"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-sm border border-yellow-300 shadow-md"></div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-blue-400/80 font-black text-sm uppercase tracking-widest animate-pulse">
            TAP TO PLACE SHAPES
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function getBlockStyle(color: BlockColor) {
  switch (color) {
    case 'red': return "bg-red-600 border border-red-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    case 'green': return "bg-green-600 border border-green-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    case 'blue': return "bg-blue-600 border border-blue-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    case 'purple': return "bg-purple-600 border border-purple-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    case 'orange': return "bg-orange-500 border border-orange-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    case 'yellow': return "bg-yellow-500 border border-yellow-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]";
    default: return "";
  }
}
