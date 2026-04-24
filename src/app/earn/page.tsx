
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Sparkles, Zap, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game Constants
const GRID_SIZE = 8; // 8x8 Grid to match image scale

type BlockColor = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';

interface Shape {
  id: string;
  color: BlockColor;
  blocks: [number, number][]; // Relative coordinates [row, col]
}

const PRESET_SHAPES: Omit<Shape, 'id'>[] = [
  { color: 'red', blocks: [[0, 1], [1, 0], [1, 1], [1, 2]] }, // T shape
  { color: 'orange', blocks: [[0, 0], [1, 0], [2, 0], [2, 1]] }, // L shape
  { color: 'yellow', blocks: [[0, 0], [0, 1], [1, 0], [1, 1]] }, // Square
  { color: 'blue', blocks: [[0, 0], [1, 0], [2, 0], [3, 0]] }, // Vertical Line
  { color: 'purple', blocks: [[0, 0], [0, 1], [0, 2]] }, // Horizontal Line
  { color: 'green', blocks: [[0, 0], [0, 1]] }, // Mini line
];

export default function EarnPage() {
  const [grid, setGrid] = useState<(BlockColor | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [shelf, setShelf] = useState<(Shape | null)[]>([]);
  const [selectedShapeIdx, setSelectedShapeIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [coins, setCoins] = useState(1000000);

  // Initialize shelf with 3 random shapes
  const refillShelf = useCallback(() => {
    const newShelf = Array(3).fill(null).map(() => ({
      ...PRESET_SHAPES[Math.floor(Math.random() * PRESET_SHAPES.length)],
      id: Math.random().toString(36).substr(2, 9),
    })) as Shape[];
    setShelf(newShelf);
  }, []);

  useEffect(() => {
    refillShelf();
    // Initial dummy blocks for aesthetic match to the user's image
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    // Simulate some blocks at the bottom
    newGrid[7][0] = 'red'; newGrid[7][1] = 'orange'; newGrid[7][2] = 'blue';
    newGrid[6][0] = 'green'; newGrid[6][1] = 'yellow';
    setGrid(newGrid);
  }, [refillShelf]);

  const checkAndClearLines = (currentGrid: (BlockColor | null)[][]) => {
    let linesCleared = 0;
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check Rows
    for (let r = 0; r < GRID_SIZE; r++) {
      if (currentGrid[r].every(cell => cell !== null)) {
        rowsToClear.push(r);
      }
    }

    // Check Cols
    for (let c = 0; c < GRID_SIZE; c++) {
      let isFull = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (currentGrid[r][c] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) colsToClear.push(c);
    }

    if (rowsToClear.length > 0 || colsToClear.length > 0) {
      const newGrid = currentGrid.map(row => [...row]);
      rowsToClear.forEach(r => newGrid[r].fill(null));
      colsToClear.forEach(c => {
        for (let r = 0; r < GRID_SIZE; r++) newGrid[r][c] = null;
      });

      setTimeout(() => {
        setGrid(newGrid);
        linesCleared = rowsToClear.length + colsToClear.length;
        setShowClear(true);
        setScore(prev => prev + (linesCleared * 100));
        setCoins(prev => prev + (linesCleared * 100));
        setTimeout(() => setShowClear(false), 2000);
      }, 300);
    }
  };

  const handlePlaceBlock = (row: number, col: number) => {
    if (selectedShapeIdx === null || !shelf[selectedShapeIdx]) return;

    const shape = shelf[selectedShapeIdx]!;
    const newGrid = grid.map(r => [...r]);

    // Validate placement
    const canPlace = shape.blocks.every(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      return (
        nr >= 0 && nr < GRID_SIZE &&
        nc >= 0 && nc < GRID_SIZE &&
        newGrid[nr][nc] === null
      );
    });

    if (canPlace) {
      shape.blocks.forEach(([dr, dc]) => {
        newGrid[row + dr][col + dc] = shape.color;
      });

      setGrid(newGrid);
      const newShelf = [...shelf];
      newShelf[selectedShapeIdx] = null;
      setShelf(newShelf);
      setSelectedShapeIdx(null);

      // Check if shelf is empty to refill
      if (newShelf.every(s => s === null)) {
        refillShelf();
      }

      checkAndClearLines(newGrid);
    }
  };

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-20 overflow-hidden">
      {/* Background gear patterns */}
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 rotate-12 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-full h-full fill-glowearn-gold">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.47-5.702 7.697-10.675 7.697-4.973 0-9.19-3.227-10.678-7.697a1.102 1.102 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-0 w-32 h-32 opacity-5 -rotate-12 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-full h-full fill-glowearn-gold">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.47-5.702 7.697-10.675 7.697-4.973 0-9.19-3.227-10.678-7.697a1.102 1.102 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
      </div>

      <FloatingElements />
      <Header />
      
      <main className="relative z-10 px-6 max-w-md mx-auto flex flex-col items-center">
        {/* Daily Bonus Banner */}
        <div className="w-full mt-4 mb-6">
          <div className="bg-black/60 border border-glowearn-gold/40 rounded-2xl py-3 px-5 flex items-center justify-between shadow-[0_0_15px_rgba(250,219,59,0.15)] backdrop-blur-md">
            <p className="text-[11px] font-black uppercase tracking-tight text-white/90">
              DAILY BONUS: <span className="text-glowearn-gold">Play today to earn +500 Coins!</span>
            </p>
            <div className="bg-glowearn-gold/20 p-1 rounded-md animate-pulse">
              <Zap size={14} className="text-glowearn-gold fill-glowearn-gold" />
            </div>
          </div>
        </div>

        {/* Glow Block Puzzle Game Board */}
        <div className="relative p-3 rounded-[2rem] bg-blue-900/10 border-[3px] border-blue-400/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] backdrop-blur-sm">
          <div className="grid grid-cols-8 gap-1.5 bg-glowearn-navy/90 p-2 rounded-2xl">
            {grid.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                {row.map((cell, cIdx) => (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handlePlaceBlock(rIdx, cIdx)}
                    className={cn(
                      "w-10 h-10 sm:w-11 sm:h-11 rounded-md transition-all duration-300 relative overflow-hidden cursor-pointer",
                      cell ? getBlockStyle(cell) : "bg-white/5 border border-white/5 hover:bg-white/10"
                    )}
                  >
                    {cell && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                        <div className="absolute inset-[2px] border border-white/10 rounded-sm"></div>
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Line Clear Overlay - Pixel Match for User Image */}
          {showClear && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-full bg-glowearn-gold/85 backdrop-blur-md py-6 shadow-[0_0_60px_rgba(250,219,59,0.9)] relative border-y-4 border-white/20">
                <div className="absolute -top-8 left-10 text-white animate-bounce">
                  <Sparkles size={32} />
                </div>
                <div className="text-center">
                  <h2 className="text-glowearn-navy font-black text-4xl italic tracking-tighter uppercase leading-none drop-shadow-lg">LINE CLEAR!</h2>
                  <p className="text-glowearn-navy font-black text-2xl mt-1 tracking-tighter drop-shadow-md">+100 Points</p>
                </div>
                <div className="absolute -bottom-8 right-10 text-white animate-bounce delay-150">
                  <Sparkles size={32} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Shelf - 3D Styled */}
        <div className="mt-8 w-full flex flex-col items-center">
          <div className="relative w-full h-32 bg-blue-400/10 rounded-t-[3rem] border-t-2 border-blue-300/20 flex items-center justify-around px-6 shadow-[inset_0_10px_20px_rgba(59,130,246,0.05)]">
            {shelf.map((shape, idx) => (
              <div 
                key={shape?.id || `empty-${idx}`}
                onClick={() => shape && setSelectedShapeIdx(idx)}
                className={cn(
                  "relative p-3 rounded-2xl transition-all cursor-pointer group",
                  selectedShapeIdx === idx ? "bg-glowearn-gold/20 scale-125 border-2 border-glowearn-gold/60 shadow-[0_0_20px_rgba(250,219,59,0.3)]" : "hover:scale-110"
                )}
              >
                {shape ? (
                  <div className="grid grid-cols-3 grid-rows-3 gap-1">
                    {shape.blocks.map(([r, c], bIdx) => (
                      <div 
                        key={bIdx}
                        style={{ gridRow: r + 1, gridColumn: c + 1 }}
                        className={cn("w-4 h-4 rounded-sm border", getBlockStyle(shape.color))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-12 h-12 border-2 border-dashed border-white/10 rounded-xl" />
                )}
                
                {/* Hand Pointer simulation for instructions */}
                {idx === 1 && !selectedShapeIdx && shape && (
                  <div className="absolute -bottom-10 right-0 animate-bounce text-white pointer-events-none">
                    <MousePointer2 size={28} className="rotate-[135deg] fill-white text-black shadow-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-blue-400/60 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
            {selectedShapeIdx !== null ? "TAP GRID TO PLACE" : "TAP TO PLACE SHAPES"}
          </p>
          
          <div className="mt-2 text-glowearn-gold font-black text-2xl italic tracking-tighter drop-shadow-[0_0_10px_rgba(250,219,59,0.5)]">
            SCORE: {score}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function getBlockStyle(color: BlockColor) {
  switch (color) {
    case 'red': return "bg-gradient-to-br from-red-500 to-red-800 border-red-400 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    case 'green': return "bg-gradient-to-br from-green-500 to-green-800 border-green-400 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    case 'blue': return "bg-gradient-to-br from-blue-500 to-blue-800 border-blue-400 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    case 'purple': return "bg-gradient-to-br from-purple-500 to-purple-800 border-purple-400 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    case 'orange': return "bg-gradient-to-br from-orange-400 to-orange-700 border-orange-300 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    case 'yellow': return "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-200 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]";
    default: return "bg-gray-600";
  }
}
