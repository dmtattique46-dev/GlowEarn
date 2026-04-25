
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game Constants
const ROWS = 8;
const COLS = 8;

type BlockType = 0 | 1 | 2 | 3 | 4 | 5; // 0 is empty, 1-5 are colors

const SHAPES = [
  { id: 'square', cells: [[1, 1], [1, 1]], color: 1 }, // Yellow
  { id: 'l-shape', cells: [[2, 0], [2, 0], [2, 2]], color: 2 }, // Orange
  { id: 't-shape', cells: [[0, 3, 0], [3, 3, 3]], color: 3 }, // Red
  { id: 'i-shape', cells: [[4, 4, 4, 4]], color: 4 }, // Blue
  { id: 'z-shape', cells: [[5, 5, 0], [0, 5, 5]], color: 5 }, // Purple
];

export default function EarnPage() {
  const [grid, setGrid] = useState<BlockType[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [score, setScore] = useState(0);
  const [shelf, setShelf] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [showLineClear, setShowLineClear] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setScore(0);
    refillShelf();
  };

  const refillShelf = () => {
    const newShelf = [];
    for (let i = 0; i < 3; i++) {
      newShelf.push(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    }
    setShelf(newShelf);
  };

  const handleCellClick = (r: number, c: number) => {
    if (selectedShape === null) return;

    const shape = shelf[selectedShape];
    if (!shape) return;

    // Check if placement is valid
    if (canPlaceShape(r, c, shape.cells)) {
      const newGrid = grid.map(row => [...row]);
      shape.cells.forEach((row: number[], dr: number) => {
        row.forEach((cellVal: number, dc: number) => {
          if (cellVal !== 0) {
            newGrid[r + dr][c + dc] = shape.color as BlockType;
          }
        });
      });

      setGrid(newGrid);
      checkLineClear(newGrid);
      
      // Update shelf
      const newShelf = [...shelf];
      newShelf[selectedShape] = null;
      setShelf(newShelf);
      setSelectedShape(null);

      // Refill shelf if all used
      if (newShelf.every(s => s === null)) {
        refillShelf();
      }
    }
  };

  const canPlaceShape = (r: number, c: number, shapeCells: number[][]) => {
    for (let dr = 0; dr < shapeCells.length; dr++) {
      for (let dc = 0; dc < shapeCells[dr].length; dc++) {
        if (shapeCells[dr][dc] !== 0) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const checkLineClear = (currentGrid: BlockType[][]) => {
    let linesCleared = 0;
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check Rows
    for (let r = 0; r < ROWS; r++) {
      if (currentGrid[r].every(cell => cell !== 0)) {
        rowsToClear.push(r);
      }
    }

    // Check Cols
    for (let c = 0; c < COLS; c++) {
      let full = true;
      for (let r = 0; r < ROWS; r++) {
        if (currentGrid[r][c] === 0) {
          full = false;
          break;
        }
      }
      if (full) colsToClear.push(c);
    }

    if (rowsToClear.length > 0 || colsToClear.length > 0) {
      const newGrid = currentGrid.map(row => [...row]);
      rowsToClear.forEach(r => {
        for (let c = 0; c < COLS; c++) newGrid[r][c] = 0;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < ROWS; r++) newGrid[r][c] = 0;
      });

      setGrid(newGrid);
      setScore(prev => prev + (rowsToClear.length + colsToClear.length) * 100);
      setShowLineClear(true);
      setTimeout(() => setShowLineClear(false), 2000);
    }
  };

  const getBlockColorClass = (type: BlockType) => {
    switch (type) {
      case 1: return "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300";
      case 2: return "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300";
      case 3: return "bg-gradient-to-br from-red-400 to-red-600 border-red-300";
      case 4: return "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300";
      case 5: return "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300";
      default: return "bg-white/5 border-white/5";
    }
  };

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-24 overflow-hidden">
      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-4 max-w-md mx-auto space-y-6 flex flex-col items-center">
        {/* Bonus Banner */}
        <div className="w-full bg-glowearn-forest/20 border border-glowearn-forest/40 rounded-2xl py-3 px-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="text-glowearn-gold" size={16} />
            <span className="text-glowearn-gold font-bold text-[10px] uppercase tracking-wider">Daily Bonus: Play today to earn +500 Coins!</span>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center space-y-1">
          <h1 className="text-glowearn-gold font-headline text-3xl font-black italic tracking-[0.15em] uppercase">
            GLOW BLOCK PUZZLE
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Score:</span>
            <span className="text-white font-black text-xl italic">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative p-2 bg-[#0c2436]/80 rounded-[2rem] border-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-8 gap-1.5 p-2">
            {grid.map((row, r) => (
              row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:border-glowearn-gold/40",
                    getBlockColorClass(cell),
                    selectedShape !== null && canPlaceShape(r, c, shelf[selectedShape].cells) && cell === 0 && "bg-glowearn-gold/10 border-glowearn-gold/30"
                  )}
                />
              ))
            ))}
          </div>

          {/* Line Clear Overlay */}
          {showLineClear && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-glowearn-navy/40 backdrop-blur-sm rounded-[2rem] animate-in fade-in zoom-in duration-300 z-20">
              <Sparkles className="text-glowearn-gold animate-bounce mb-2" size={48} />
              <h2 className="text-glowearn-gold font-headline text-4xl font-black italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(250,219,59,0.8)]">
                LINE CLEAR!
              </h2>
              <span className="text-white font-black text-xl italic">+100 POINTS</span>
            </div>
          )}
        </div>

        {/* Shape Shelf */}
        <section className="w-full space-y-4 pt-4">
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 text-white/40">
              <MousePointer2 size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Place Shapes</span>
             </div>
             <div className="flex justify-around items-center w-full bg-[#0c2436]/60 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
               {shelf.map((shape, idx) => (
                 <div 
                  key={idx}
                  onClick={() => setSelectedShape(idx)}
                  className={cn(
                    "relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer h-24 w-24 rounded-2xl border",
                    selectedShape === idx ? "bg-glowearn-gold/20 border-glowearn-gold scale-110 shadow-[0_0_20px_rgba(250,219,59,0.3)]" : "bg-black/20 border-white/5 hover:border-white/20",
                    !shape && "opacity-20 pointer-events-none"
                  )}
                 >
                   {shape && (
                     <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${shape.cells[0].length}, minmax(0, 1fr))` }}>
                       {shape.cells.flat().map((c: number, i: number) => (
                         <div 
                          key={i} 
                          className={cn(
                            "w-4 h-4 rounded-sm border",
                            c !== 0 ? getBlockColorClass(shape.color as BlockType) : "bg-transparent border-transparent"
                          )}
                         />
                       ))}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Background Gear Pattern Decorations */}
        <div className="fixed bottom-24 -left-12 opacity-5 pointer-events-none">
          <div className="w-48 h-48 border-8 border-glowearn-gold rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="fixed bottom-40 -right-12 opacity-5 pointer-events-none">
          <div className="w-64 h-64 border-8 border-glowearn-gold rounded-full border-dashed animate-[spin_30s_linear_infinite_reverse]" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
