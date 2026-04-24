
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Sparkles, Zap, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game Constants
const GRID_ROWS = 8;
const GRID_COLS = 6;

type BlockColor = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';

interface Shape {
  id: string;
  color: BlockColor;
  blocks: [number, number][]; // Relative coordinates [row, col]
}

const PRESET_SHAPES: Omit<Shape, 'id'>[] = [
  { color: 'red', blocks: [[0, 0], [1, 0], [1, 1]] }, // L small
  { color: 'orange', blocks: [[0, 0], [0, 1], [0, 2], [1, 1]] }, // T shape
  { color: 'yellow', blocks: [[0, 0], [0, 1], [1, 0], [1, 1]] }, // Square
  { color: 'blue', blocks: [[0, 0], [1, 0], [2, 0]] }, // I shape
  { color: 'purple', blocks: [[0, 0], [0, 1], [0, 2]] }, // Horizontal I
  { color: 'green', blocks: [[0, 0]] }, // Single dot
];

export default function EarnPage() {
  const [grid, setGrid] = useState<(BlockColor | null)[][]>(
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null))
  );
  const [shelf, setShelf] = useState<(Shape | null)[]>([]);
  const [selectedShapeIdx, setSelectedShapeIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [coins, setCoins] = useState(12500);

  // Initialize shelf
  const refillShelf = useCallback(() => {
    const newShelf = Array(3).fill(null).map(() => ({
      ...PRESET_SHAPES[Math.floor(Math.random() * PRESET_SHAPES.length)],
      id: Math.random().toString(36).substr(2, 9),
    })) as Shape[];
    setShelf(newShelf);
  }, []);

  useEffect(() => {
    refillShelf();
    // Initial dummy blocks for aesthetic match
    const newGrid = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
    newGrid[7][0] = 'red'; newGrid[7][1] = 'orange'; newGrid[7][2] = 'orange';
    setGrid(newGrid);
  }, [refillShelf]);

  const checkAndClearLines = (currentGrid: (BlockColor | null)[][]) => {
    let linesCleared = 0;
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check Rows
    for (let r = 0; r < GRID_ROWS; r++) {
      if (currentGrid[r].every(cell => cell !== null)) {
        rowsToClear.push(r);
      }
    }

    // Check Cols
    for (let c = 0; c < GRID_COLS; c++) {
      let isFull = true;
      for (let r = 0; r < GRID_ROWS; r++) {
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
        for (let r = 0; r < GRID_ROWS; r++) newGrid[r][c] = null;
      });

      setGrid(newGrid);
      linesCleared = rowsToClear.length + colsToClear.length;
      setShowClear(true);
      setScore(prev => prev + (linesCleared * 100));
      setCoins(prev => prev + (linesCleared * 100));
      setTimeout(() => setShowClear(false), 2000);
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
        nr >= 0 && nr < GRID_ROWS &&
        nc >= 0 && nc < GRID_COLS &&
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

        {/* Game Board */}
        <div className="relative p-2 rounded-3xl bg-blue-900/20 border-[3px] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="grid grid-cols-6 gap-1 bg-glowearn-navy/80 p-1 rounded-xl">
            {grid.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                {row.map((cell, cIdx) => (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handlePlaceBlock(rIdx, cIdx)}
                    className={cn(
                      "w-12 h-12 rounded-lg transition-all duration-300 relative overflow-hidden cursor-pointer",
                      cell ? getBlockStyle(cell) : "bg-white/5 border border-white/5 shadow-inner hover:bg-white/10"
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
          <div className="relative w-full h-24 bg-blue-400/20 rounded-t-[2.5rem] border-t-2 border-blue-300/40 flex items-center justify-around px-4">
            {shelf.map((shape, idx) => (
              <div 
                key={shape?.id || `empty-${idx}`}
                onClick={() => shape && setSelectedShapeIdx(idx)}
                className={cn(
                  "relative p-2 rounded-xl transition-all cursor-pointer group",
                  selectedShapeIdx === idx ? "bg-glowearn-gold/20 scale-110 border border-glowearn-gold/40" : "hover:scale-105"
                )}
              >
                {shape ? (
                  <div className="grid grid-cols-3 grid-rows-2 gap-0.5">
                    {/* Render minimal preview of shape */}
                    {shape.blocks.map(([r, c], bIdx) => (
                      <div 
                        key={bIdx}
                        style={{ gridRow: r + 1, gridColumn: c + 1 }}
                        className={cn("w-3.5 h-3.5 rounded-sm border", getBlockStyle(shape.color))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-10 h-10 border-2 border-dashed border-white/10 rounded-lg" />
                )}
                
                {idx === 1 && !selectedShapeIdx && shape && (
                  <div className="absolute -bottom-8 right-0 animate-bounce text-white pointer-events-none">
                    <MousePointer2 size={24} className="rotate-[135deg] fill-white text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-blue-400/80 font-black text-xs uppercase tracking-widest animate-pulse">
            {selectedShapeIdx !== null ? "TAP GRID TO PLACE" : "TAP SHAPE TO SELECT"}
          </p>
          
          <div className="mt-2 text-glowearn-gold font-black text-lg italic">
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
    case 'red': return "bg-red-600 border-red-400 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    case 'green': return "bg-green-600 border-green-400 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    case 'blue': return "bg-blue-600 border-blue-400 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    case 'purple': return "bg-purple-600 border-purple-400 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    case 'orange': return "bg-orange-500 border-orange-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    case 'yellow': return "bg-yellow-500 border-yellow-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
    default: return "";
  }
}
