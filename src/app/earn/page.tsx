
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Game Constants
const ROWS = 8;
const COLS = 8;
const OFFSET_Y = 80;

type BlockType = 0 | 1 | 2 | 3 | 4 | 5;

const SHAPES = [
  { id: 'square', cells: [[1, 1], [1, 1]], color: 1 },
  { id: 'l-shape', cells: [[2, 0], [2, 0], [2, 2]], color: 2 },
  { id: 't-shape', cells: [[0, 3, 0], [3, 3, 3]], color: 3 },
  { id: 'i-shape', cells: [[4, 4, 4, 4]], color: 4 },
  { id: 'z-shape', cells: [[5, 5, 0], [0, 5, 5]], color: 5 },
];

export default function EarnPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [grid, setGrid] = useState<BlockType[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [score, setScore] = useState(0);
  const [shelf, setShelf] = useState<(any | null)[]>([]);
  const [showLineClear, setShowLineClear] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showCoinsAnim, setShowCoinsAnim] = useState(false);

  // Drag State
  const [dragState, setDragState] = useState<{
    index: number | null;
    pos: { x: number; y: number };
    ghost: { r: number; c: number } | null;
  }>({ index: null, pos: { x: 0, y: 0 }, ghost: null });

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (!session) {
      router.push('/auth/signup');
    } else {
      setUser(JSON.parse(session));
      resetGame();
    }
  }, [router]);

  const updateUserPersistence = (newBalance: number, newPoints: number) => {
    if (!user) return;
    
    // Leveling Logic
    const calculateLevel = (totalXP: number) => {
      let level = 1;
      let remainingXP = totalXP;
      while (level < 15 && remainingXP >= 100) {
        remainingXP -= 100;
        level++;
      }
      if (level >= 15) {
        let xpNeeded = 100 * Math.pow(1.2, level - 15);
        while (remainingXP >= xpNeeded) {
          remainingXP -= xpNeeded;
          level++;
          xpNeeded = 100 * Math.pow(1.2, level - 15);
        }
      }
      return level;
    };

    const newLevel = calculateLevel(newPoints);
    const updatedUser = { ...user, balance: newBalance, points: newPoints, level: newLevel };
    setUser(updatedUser);
    localStorage.setItem('glowearn_current_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('glowearn_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('glowearn_users', JSON.stringify(users));
    }
  };

  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setScore(0);
    setIsGameOver(false);
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

  const canPlaceShape = useCallback((r: number, c: number, shapeCells: number[][], currentGrid: BlockType[][]) => {
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
  }, []);

  const checkGameOver = useCallback((currentGrid: BlockType[][], currentShelf: (any | null)[]) => {
    const hasAnyMove = currentShelf.some((shape) => {
      if (!shape) return false;
      for (let r = 0; r <= ROWS - shape.cells.length; r++) {
        for (let c = 0; c <= COLS - shape.cells[0].length; c++) {
          if (canPlaceShape(r, c, shape.cells, currentGrid)) return true;
        }
      }
      return false;
    });
    return !hasAnyMove;
  }, [canPlaceShape]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (!shelf[index] || isGameOver) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setDragState({
      index,
      pos: { x: clientX, y: clientY },
      ghost: null
    });
    triggerHaptic(30);
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (dragState.index === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    let newGhost: { r: number; c: number } | null = null;
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const cellSize = (rect.width - 16) / COLS; // Adjusting for p-2 padding
      const shape = shelf[dragState.index];
      
      const visualX = clientX;
      const visualY = clientY - OFFSET_Y;

      const gridX = visualX - rect.left - 8;
      const gridY = visualY - rect.top - 8;

      const shapeHalfWidth = (shape.cells[0].length * cellSize) / 2;
      const shapeHalfHeight = (shape.cells.length * cellSize) / 2;

      const c = Math.round((gridX - shapeHalfWidth) / cellSize);
      const r = Math.round((gridY - shapeHalfHeight) / cellSize);

      if (r >= 0 && r <= ROWS - shape.cells.length && c >= 0 && c <= COLS - shape.cells[0].length) {
        if (canPlaceShape(r, c, shape.cells, grid)) {
          newGhost = { r, c };
        }
      }
    }

    setDragState(prev => ({
      ...prev,
      pos: { x: clientX, y: clientY },
      ghost: newGhost
    }));
  }, [dragState.index, shelf, grid, canPlaceShape]);

  const handleDragEnd = useCallback(() => {
    if (dragState.index === null) return;

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

      // Clear Lines Logic
      const rowsToClear: number[] = [];
      const colsToClear: number[] = [];
      for (let ir = 0; ir < ROWS; ir++) if (newGrid[ir].every(cell => cell !== 0)) rowsToClear.push(ir);
      for (let ic = 0; ic < COLS; ic++) {
        let full = true;
        for (let ir = 0; ir < ROWS; ir++) if (newGrid[ir][ic] === 0) { full = false; break; }
        if (full) colsToClear.push(ic);
      }

      const totalLines = rowsToClear.length + colsToClear.length;
      if (totalLines > 0) {
        rowsToClear.forEach(ri => newGrid[ri].fill(0));
        colsToClear.forEach(ci => { for (let ri = 0; ri < ROWS; ri++) newGrid[ri][ci] = 0; });
        
        const xpMultiplier = user.level < 15 ? 2 : 1;
        const xpEarned = totalLines * 20 * xpMultiplier;
        const balanceEarned = totalLines * 1.00;
        
        setScore(prev => prev + (totalLines * 100));
        updateUserPersistence(user.balance + balanceEarned, user.points + xpEarned);
        
        setShowLineClear(true);
        setShowCoinsAnim(true);
        setTimeout(() => { setShowLineClear(false); setShowCoinsAnim(false); }, 1500);
        triggerHaptic([100, 50, 100]);
      }

      setGrid(newGrid);
      const newShelf = [...shelf];
      newShelf[dragState.index] = null;
      if (newShelf.every(s => s === null)) refillShelf();
      else setShelf(newShelf);

      // Check Game Over
      if (checkGameOver(newGrid, newShelf.every(s => s === null) ? SHAPES : newShelf)) {
        setIsGameOver(true);
      }
    }

    setDragState({ index: null, pos: { x: 0, y: 0 }, ghost: null });
  }, [dragState, shelf, grid, user, checkGameOver]);

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

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-24 overflow-hidden select-none touch-none">
      <FloatingElements />
      <Header usdBalance={user.balance} coinCount={user.points} animate={showCoinsAnim} />
      
      <main className="relative z-10 px-4 max-w-md mx-auto space-y-6 flex flex-col items-center">
        <div className="text-center space-y-1">
          <h1 className="text-glowearn-gold font-headline text-3xl font-black italic tracking-[0.15em] uppercase">
            GLOW PUZZLE
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Score:</span>
            <span className="text-white font-black text-xl italic">{score.toLocaleString()}</span>
          </div>
        </div>

        <div 
          ref={boardRef}
          className="w-full max-w-[400px] aspect-square p-2 bg-[#0c2436]/80 rounded-[1.5rem] border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative"
        >
          <div className="grid grid-cols-8 gap-1 h-full w-full">
            {grid.map((row, r) => (
              row.map((cell, c) => {
                const shape = dragState.index !== null ? shelf[dragState.index] : null;
                const isGhost = dragState.ghost && shape && 
                                r >= dragState.ghost.r && r < dragState.ghost.r + shape.cells.length &&
                                c >= dragState.ghost.c && c < dragState.ghost.c + shape.cells[0].length &&
                                shape.cells[r - dragState.ghost.r][c - dragState.ghost.c] !== 0;

                return (
                  <div 
                    key={`${r}-${c}`}
                    className={cn(
                      "aspect-square w-full rounded-sm border transition-all duration-200",
                      cell === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]",
                      cell === 2 && "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]",
                      cell === 3 && "bg-gradient-to-br from-red-400 to-red-600 border-red-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]",
                      cell === 4 && "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]",
                      cell === 5 && "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)]",
                      cell === 0 && !isGhost && "bg-white/5 border-white/5",
                      isGhost && "bg-yellow-500/20 border-yellow-500/50 scale-[0.95]"
                    )}
                  />
                );
              })
            ))}
          </div>

          {showLineClear && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-glowearn-navy/40 backdrop-blur-sm rounded-[1.5rem] z-20 animate-in zoom-in duration-300">
              <Sparkles className="text-glowearn-gold animate-bounce mb-2" size={48} />
              <h2 className="text-glowearn-gold font-headline text-4xl font-black italic uppercase tracking-tighter drop-shadow-[0_0_15px_#fadb3b]">LINE CLEAR!</h2>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-glowearn-navy/90 backdrop-blur-xl rounded-[1.5rem] animate-in fade-in duration-500">
              <Trophy className="text-glowearn-gold w-16 h-16 animate-pulse mb-4" />
              <h2 className="text-glowearn-gold font-headline text-4xl font-black italic tracking-tighter uppercase mb-2">GAME OVER</h2>
              <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-6">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="shimmer-btn py-4 px-8 rounded-2xl text-glowearn-navy font-black text-lg uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform"
              >
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          )}
        </div>

        <section className={cn("w-full space-y-4 pt-2", isGameOver && "opacity-20 pointer-events-none")}>
          <div className="flex justify-around items-center w-full bg-[#0c2436]/60 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            {shelf.map((shape, idx) => (
              <div 
                key={idx}
                onMouseDown={(e) => handleDragStart(e, idx)}
                onTouchStart={(e) => handleDragStart(e, idx)}
                className={cn(
                  "relative flex flex-col items-center justify-center h-24 w-24 rounded-2xl border transition-all cursor-grab active:cursor-grabbing",
                  dragState.index === idx ? "opacity-0" : "bg-black/30 border-white/5 hover:scale-105 hover:border-white/20 hover:bg-white/5",
                  !shape && "opacity-0 pointer-events-none"
                )}
              >
                {shape && (
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape.cells[0].length}, minmax(0, 1fr))` }}>
                    {shape.cells.flat().map((c: number, i: number) => (
                      <div 
                        key={i} 
                        className={cn("w-5 h-5 aspect-square rounded-[2px] border-[1px]", 
                          c !== 0 ? "bg-glowearn-gold border-white/40 shadow-sm" : "bg-transparent border-transparent"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">Drag to place shapes</p>
        </section>
      </main>

      {/* Drag Overlay */}
      {dragState.index !== null && shelf[dragState.index] && (
        <div 
          className="fixed pointer-events-none z-[200] scale-[1.2] drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
          style={{
            left: dragState.pos.x,
            top: dragState.pos.y - OFFSET_Y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="grid gap-1" 
            style={{ gridTemplateColumns: `repeat(${shelf[dragState.index].cells[0].length}, minmax(0, 1fr))` }}
          >
            {shelf[dragState.index].cells.flat().map((c: number, i: number) => (
              <div 
                key={i} 
                className={cn("w-8 h-8 rounded-[4px] border-2 aspect-square", 
                  c !== 0 ? "bg-glowearn-gold border-white/60 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]" : "bg-transparent border-transparent"
                )}
              />
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
