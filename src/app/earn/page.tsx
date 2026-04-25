
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
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
  const [shelf, setShelf] = useState<(any | null)[]>([]);
  const [showLineClear, setShowLineClear] = useState(false);
  
  // Coin Logic State
  const [coins, setCoins] = useState(20.00); // USD Balance
  const [coinCount, setCoinCount] = useState(1000000); // Integer Coins
  const [showCoinsAnim, setShowCoinsAnim] = useState(false);

  // Drag State
  const [dragState, setDragState] = useState<{
    index: number | null;
    pos: { x: number; y: number };
    ghost: { r: number; c: number } | null;
  }>({ index: null, pos: { x: 0, y: 0 }, ghost: null });

  const boardRef = useRef<HTMLDivElement>(null);

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

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  const canPlaceShape = (r: number, c: number, shapeCells: number[][], currentGrid: BlockType[][]) => {
    for (let dr = 0; dr < shapeCells.length; dr++) {
      for (let dc = 0; dc < shapeCells[dr].length; dc++) {
        if (shapeCells[dr][dc] !== 0) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || currentGrid[nr][nc] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const checkLineClear = (currentGrid: BlockType[][]) => {
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    for (let r = 0; r < ROWS; r++) {
      if (currentGrid[r].every(cell => cell !== 0)) rowsToClear.push(r);
    }

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

    const totalLinesCleared = rowsToClear.length + colsToClear.length;

    if (totalLinesCleared > 0) {
      const newGrid = currentGrid.map(row => [...row]);
      rowsToClear.forEach(r => {
        for (let c = 0; c < COLS; c++) newGrid[r][c] = 0;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < ROWS; r++) newGrid[r][c] = 0;
      });

      setGrid(newGrid);
      setScore(prev => prev + totalLinesCleared * 100);
      
      // Update Balance Logic
      setCoins(prev => parseFloat((prev + (totalLinesCleared * 1.00)).toFixed(2)));
      setCoinCount(prev => prev + (totalLinesCleared * 50000)); // Every $1 is 50k coins in this reward loop
      
      setShowLineClear(true);
      setShowCoinsAnim(true);
      triggerHaptic([100, 50, 100]);
      
      setTimeout(() => setShowLineClear(false), 2000);
      setTimeout(() => setShowCoinsAnim(false), 1500);
    }
  };

  // Drag Handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (!shelf[index]) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      index,
      pos: { x: clientX, y: clientY },
      ghost: null
    });
    triggerHaptic(30);
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (dragState.index === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate Grid Ghost Position
    let newGhost: { r: number; c: number } | null = null;
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const cellSize = rect.width / COLS;
      
      // The 80px Offset Rule: Calculate the board target relative to the visual block (80px above finger)
      const targetX = clientX - rect.left;
      const targetY = (clientY - 80) - rect.top;

      const c = Math.floor(targetX / cellSize);
      const r = Math.floor(targetY / cellSize);

      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        if (canPlaceShape(r, c, shelf[dragState.index].cells, grid)) {
          newGhost = { r, c };
        }
      }
    }

    setDragState(prev => ({
      ...prev,
      pos: { x: clientX, y: clientY },
      ghost: newGhost
    }));
  }, [dragState.index, shelf, grid]);

  const handleDragEnd = useCallback(() => {
    if (dragState.index === null) {
      setDragState({ index: null, pos: { x: 0, y: 0 }, ghost: null });
      return;
    }

    const shape = shelf[dragState.index];
    if (dragState.ghost && shape) {
      const { r, c } = dragState.ghost;
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
      triggerHaptic(50);

      const newShelf = [...shelf];
      newShelf[dragState.index] = null;
      if (newShelf.every(s => s === null)) {
        refillShelf();
      } else {
        setShelf(newShelf);
      }
    }

    setDragState({ index: null, pos: { x: 0, y: 0 }, ghost: null });
  }, [dragState, shelf, grid]);

  useEffect(() => {
    if (dragState.index !== null) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [dragState.index, handleDragMove, handleDragEnd]);

  const getBlockColorClass = (type: BlockType) => {
    switch (type) {
      case 1: return "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
      case 2: return "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
      case 3: return "bg-gradient-to-br from-red-400 to-red-600 border-red-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
      case 4: return "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
      case 5: return "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]";
      default: return "bg-white/5 border-white/5";
    }
  };

  const isCellGhost = (r: number, c: number) => {
    if (!dragState.ghost || dragState.index === null) return false;
    const shape = shelf[dragState.index];
    if (!shape) return false;
    
    const { r: gr, c: gc } = dragState.ghost;
    const dr = r - gr;
    const dc = c - gc;
    
    return dr >= 0 && dr < shape.cells.length && 
           dc >= 0 && dc < shape.cells[0].length && 
           shape.cells[dr][dc] !== 0;
  };

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-24 overflow-hidden select-none touch-none">
      <FloatingElements />
      <Header usdBalance={coins} coinCount={coinCount} animate={showCoinsAnim} />
      
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
        <div 
          ref={boardRef}
          className="w-full max-w-[400px] aspect-square p-2 bg-[#0c2436]/80 rounded-[1.5rem] border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative"
        >
          <div className="grid grid-cols-8 gap-1 h-full w-full">
            {grid.map((row, r) => (
              row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  className={cn(
                    "aspect-square w-full rounded-sm border-2 transition-all duration-300",
                    getBlockColorClass(cell),
                    isCellGhost(r, c) && "bg-white/30 border-white/50 scale-[0.9] opacity-60 ring-2 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  )}
                />
              ))
            ))}
          </div>

          {/* Line Clear Overlay */}
          {showLineClear && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-glowearn-navy/60 backdrop-blur-md rounded-[1.5rem] animate-in fade-in zoom-in duration-300 z-20">
              <div className="relative">
                <Sparkles className="text-glowearn-gold animate-bounce mb-2" size={64} />
                <div className="absolute inset-0 animate-ping rounded-full bg-glowearn-gold/20"></div>
              </div>
              <h2 className="text-glowearn-gold font-headline text-4xl font-black italic uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(250,219,59,1)]">
                LINE CLEAR!
              </h2>
              <span className="text-white font-black text-2xl italic mt-2">+100 POINTS</span>
            </div>
          )}
        </div>

        {/* Floating Dragged Block - Follows finger with 80px offset */}
        {dragState.index !== null && shelf[dragState.index] && (
          <div 
            className="fixed pointer-events-none z-[100] transition-transform duration-75"
            style={{ 
              left: dragState.pos.x, 
              top: dragState.pos.y - 80, // THE 80PX RULE
              transform: 'translate(-50%, -50%) scale(1.15)', // POP-UP EFFECT
            }}
          >
            <div 
              className="grid gap-1 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" 
              style={{ gridTemplateColumns: `repeat(${shelf[dragState.index].cells[0].length}, minmax(0, 1fr))` }}
            >
              {shelf[dragState.index].cells.flat().map((c: number, i: number) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-8 h-8 aspect-square rounded-[4px] border-2",
                    c !== 0 ? getBlockColorClass(shelf[dragState.index!].color as BlockType) : "bg-transparent border-transparent"
                  )}
                />
              ))}
            </div>
            {/* Soft Glow Shadow Under Dragged Block */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-4 bg-black/40 blur-xl rounded-full scale-125" />
          </div>
        )}

        {/* Shape Shelf */}
        <section className="w-full space-y-4 pt-2">
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-white/40">
              <MousePointer2 size={14} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Drag Shapes to Board</span>
             </div>
             
             <div className="flex justify-around items-center w-full bg-[#0c2436]/60 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-inner">
               {shelf.map((shape, idx) => (
                 <div 
                  key={idx}
                  onMouseDown={(e) => handleDragStart(e, idx)}
                  onTouchStart={(e) => handleDragStart(e, idx)}
                  className={cn(
                    "relative flex flex-col items-center justify-center transition-all duration-300 cursor-grab active:cursor-grabbing h-24 w-24 rounded-2xl border aspect-square",
                    dragState.index === idx ? "opacity-0 scale-90" : "bg-black/30 border-white/5 hover:border-white/20 active:scale-95",
                    !shape && "opacity-0 pointer-events-none"
                  )}
                 >
                   {shape && (
                     <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${shape.cells[0].length}, minmax(0, 1fr))` }}>
                       {shape.cells.flat().map((c: number, i: number) => (
                         <div 
                          key={i} 
                          className={cn(
                            "w-5 h-5 aspect-square rounded-[2px] border-[1px]",
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
