
"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingElements } from '@/components/background/FloatingElements';
import { Sparkles, Trophy, RotateCcw, Zap, Gamepad2, ChevronLeft, Lock, Play, Clock, CheckCircle2, AlertCircle, ExternalLink, PlayCircle, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, increment, serverTimestamp } from 'firebase/firestore';
import { Progress } from "@/components/ui/progress";

// Game Constants
const ROWS = 8;
const COLS = 8;
const OFFSET_Y = 80;

type BlockType = 0 | 1 | 2 | 3 | 4 | 5;
type GameState = 'menu' | 'puzzle' | 'quick-solve' | 'watch-boost';

const SHAPES = [
  { id: 'square', cells: [[1, 1], [1, 1]], color: 1 },
  { id: 'l-shape', cells: [[2, 0], [2, 0], [2, 2]], color: 2 },
  { id: 't-shape', cells: [[0, 3, 0], [3, 3, 3]], color: 3 },
  { id: 'i-shape', cells: [[4, 4, 4, 4]], color: 4 },
  { id: 'z-shape', cells: [[5, 5, 0], [0, 5, 5]], color: 5 },
];

export default function EarnPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<GameState>('menu');
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [grid, setGrid] = useState<BlockType[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [score, setScore] = useState(0);
  const [shelf, setShelf] = useState<(any | null)[]>([]);
  const [showLineClear, setShowLineClear] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showCoinsAnim, setShowCoinsAnim] = useState(false);
  
  // Quick Solve State
  const [targetCode, setTargetCode] = useState<string>('');
  const [userCode, setUserCode] = useState<string>('');
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Watch & Boost State
  const [adTimer, setAdTimer] = useState<number>(0);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const AD_THRESHOLD = 1500;
  const AD_URL = "https://www.highrevenuenetwork.com/your-smart-link-here"; // Adsterra Smart Link Placeholder

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = localStorage.getItem('glowearn_current_user');
    if (!session) {
      router.push('/auth/signup');
    } else {
      setSessionUser(JSON.parse(session));
      resetGame();
    }
  }, [router]);

  const userRef = useMemoFirebase(() => {
    if (!firestore || !sessionUser?.id) return null;
    return doc(firestore, 'users', sessionUser.id);
  }, [firestore, sessionUser?.id]);

  const { data: userData } = useDoc(userRef);

  const isAdmin = userData?.isAdmin || sessionUser?.isAdmin;

  // Sync Coins Logic (Rate: $0.50 per 1000 coins)
  const syncCoinsToFirestore = useCallback((coinReward: number) => {
    if (!userRef) return;
    const usdReward = (coinReward / 1000) * 0.50;
    
    updateDocumentNonBlocking(userRef, {
      coins: increment(coinReward),
      usd: increment(usdReward),
      xp: increment(Math.floor(coinReward / 10)),
      updatedAt: serverTimestamp()
    });
  }, [userRef]);

  // Cooldown Logic for Quick Solve
  useEffect(() => {
    if (activeTab === 'quick-solve' && userData?.lastQuickPuzzleAt) {
      const lastSolve = new Date(userData.lastQuickPuzzleAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - lastSolve) / 1000);
      const remaining = Math.max(0, 60 - diff);
      setCooldownRemaining(remaining);

      if (remaining > 0) {
        const timer = setInterval(() => {
          setCooldownRemaining(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [activeTab, userData?.lastQuickPuzzleAt]);

  const generateNewQuickPuzzle = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setTargetCode(code);
    setUserCode('');
    setSuccessMessage(null);
  };

  const handleSolveQuickPuzzle = () => {
    if (userCode === targetCode || isAdmin) {
      if (cooldownRemaining > 0 && !isAdmin) return;

      syncCoinsToFirestore(20);
      if (userRef) {
        updateDocumentNonBlocking(userRef, {
          lastQuickPuzzleAt: new Date().toISOString()
        });
      }
      
      setSuccessMessage('Congratulations! +20 Coins added');
      setShowCoinsAnim(true);
      setTimeout(() => {
        setSuccessMessage(null);
        setShowCoinsAnim(false);
        generateNewQuickPuzzle();
      }, 2000);
      triggerHaptic([50, 30, 50]);
    } else {
      triggerHaptic(100);
    }
  };

  // Watch & Boost Logic
  const handleWatchAd = () => {
    if (adTimer > 0) return;
    
    window.open(AD_URL, '_blank');
    setIsAdLoading(true);
    
    // Admin bypass: shorter wait
    const waitTime = isAdmin ? 3 : 15;
    setAdTimer(waitTime);
    
    const timer = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          completeAdWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeAdWatch = () => {
    if (!userRef) return;
    
    updateDocumentNonBlocking(userRef, {
      adsWatched: increment(1),
      xp: increment(5),
      updatedAt: serverTimestamp()
    });
    
    setIsAdLoading(false);
    setSuccessMessage('Ad Verified! +1 Progress Added');
    triggerHaptic([100, 50, 100]);
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  // Block Puzzle Logic
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

  const [dragState, setDragState] = useState<{
    index: number | null;
    pos: { x: number; y: number };
    ghost: { r: number; c: number } | null;
  }>({ index: null, pos: { x: 0, y: 0 }, ghost: null });

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
      const cellSize = (rect.width - 16) / COLS;
      const shape = shelf[dragState.index];
      
      const gridX = clientX - rect.left - 8;
      const gridY = (clientY - OFFSET_Y) - rect.top - 8;

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
        
        const coinReward = totalLines * 100;
        setScore(prev => prev + coinReward);
        syncCoinsToFirestore(coinReward);
        
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

      if (checkGameOver(newGrid, newShelf.every(s => s === null) ? SHAPES : newShelf)) {
        setIsGameOver(true);
      }
    }

    setDragState({ index: null, pos: { x: 0, y: 0 }, ghost: null });
  }, [dragState, shelf, grid, syncCoinsToFirestore, checkGameOver]);

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

  if (!sessionUser) return null;

  return (
    <div className="relative min-h-screen bg-glowearn-navy pb-24 pt-24 overflow-hidden select-none touch-none">
      <FloatingElements />
      <Header animate={showCoinsAnim} />
      
      <main className="relative z-10 px-6 max-w-md mx-auto space-y-8 flex flex-col items-center">
        
        {activeTab === 'menu' ? (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center space-y-2">
              <h1 className="text-glowearn-gold font-headline text-4xl font-black italic tracking-tighter uppercase">
                Choose Your <span className="text-white">Challenge</span>
              </h1>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Select a game to start earning</p>
            </header>

            <div className="grid gap-6">
              <Card 
                className="bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-glowearn-gold transition-all duration-300"
                onClick={() => setActiveTab('puzzle')}
              >
                <div className="relative h-40 w-full">
                  <Image 
                    src="https://picsum.photos/seed/puzzle-game/600/400" 
                    alt="Glow Block Puzzle"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    data-ai-hint="glow blocks"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2436] to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-white font-headline font-black text-xl uppercase italic">Glow Block Puzzle</h2>
                    <p className="text-glowearn-gold text-[10px] font-bold uppercase tracking-widest">High Rewards</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-glowearn-gold transition-all duration-300"
                onClick={() => {
                  setActiveTab('quick-solve');
                  generateNewQuickPuzzle();
                }}
              >
                <div className="relative h-40 w-full">
                  <Image 
                    src="https://picsum.photos/seed/quick-puzzle/600/400" 
                    alt="Golden Solve"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    data-ai-hint="golden code"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2436] to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-white font-headline font-black text-xl uppercase italic">Golden Solve</h2>
                    <p className="text-glowearn-gold text-[10px] font-bold uppercase tracking-widest">+20 Coins Reward</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-glowearn-gold transition-all duration-300"
                onClick={() => setActiveTab('watch-boost')}
              >
                <div className="relative h-40 w-full">
                  <Image 
                    src="https://picsum.photos/seed/ads-boost/600/400" 
                    alt="Watch & Boost"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    data-ai-hint="gold stars"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2436] to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-white font-headline font-black text-xl uppercase italic">Watch & Boost</h2>
                    <p className="text-glowearn-gold text-[10px] font-bold uppercase tracking-widest">Unlock Withdrawals</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : activeTab === 'quick-solve' ? (
          <div className="w-full flex flex-col items-center space-y-8 animate-in zoom-in duration-300 max-w-sm">
            <button 
              onClick={() => setActiveTab('menu')}
              className="self-start flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-full transition-all"
            >
              <ChevronLeft size={16} /> Back to Menu
            </button>

            <header className="text-center space-y-2">
              <h1 className="text-glowearn-gold font-headline text-3xl font-black italic uppercase">Golden Solve</h1>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Verify the golden code</p>
            </header>

            <Card className="w-full bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-4">
                <div className="bg-black/40 py-6 rounded-3xl border border-glowearn-gold/10">
                  <span className="text-glowearn-gold font-headline text-5xl font-black tracking-[0.2em] italic drop-shadow-[0_0_10px_#fadb3b]">
                    {targetCode}
                  </span>
                </div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Enter the code above to claim gold</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="number"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Enter Code"
                  className="w-full bg-black/60 border-2 border-glowearn-gold/20 rounded-2xl py-4 text-center text-white font-black text-2xl focus:border-glowearn-gold outline-none transition-all"
                  maxLength={4}
                />

                {cooldownRemaining > 0 && !isAdmin && (
                  <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                    <Clock size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Anti-Cheat Active: {cooldownRemaining}s</span>
                  </div>
                )}

                <button 
                  onClick={handleSolveQuickPuzzle}
                  disabled={cooldownRemaining > 0 && !isAdmin}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                    cooldownRemaining > 0 && !isAdmin 
                      ? "bg-white/5 text-white/20 grayscale cursor-not-allowed" 
                      : "shimmer-btn text-glowearn-navy shadow-[0_10px_30px_rgba(250,219,59,0.3)] active:scale-95"
                  )}
                >
                  {isAdmin ? <Sparkles size={18} /> : <CheckCircle2 size={18} />}
                  {isAdmin ? 'Auto-Solve (Admin)' : 'Claim Reward'}
                </button>
              </div>

              {successMessage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-glowearn-navy/90 backdrop-blur-md rounded-[2.5rem] z-20 animate-in fade-in zoom-in duration-300 text-center px-6">
                  <Sparkles className="text-glowearn-gold w-16 h-16 animate-bounce mb-4" />
                  <h2 className="text-glowearn-gold font-headline text-2xl font-black italic uppercase tracking-tighter drop-shadow-[0_0_15px_#fadb3b]">
                    {successMessage}
                  </h2>
                </div>
              )}
            </Card>

            <div className="flex items-center gap-2 text-white/20 font-bold uppercase text-[9px] tracking-widest">
              <AlertCircle size={12} />
              <span>Limit: 1 reward per minute</span>
            </div>
          </div>
        ) : activeTab === 'watch-boost' ? (
          <div className="w-full flex flex-col items-center space-y-8 animate-in zoom-in duration-300 max-w-sm">
            <button 
              onClick={() => setActiveTab('menu')}
              className="self-start flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-full transition-all"
            >
              <ChevronLeft size={16} /> Back to Menu
            </button>

            <header className="text-center space-y-2">
              <h1 className="text-glowearn-gold font-headline text-3xl font-black italic uppercase">Watch & Boost</h1>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Increase your ad verification count</p>
            </header>

            <Card className="w-full bg-[#0c2436]/80 border-2 border-glowearn-gold/30 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/60">Ads Watched Progress</span>
                  <span className="text-glowearn-gold">
                    {userData?.adsWatched || 0} / {AD_THRESHOLD}
                  </span>
                </div>
                <Progress 
                  value={((userData?.adsWatched || 0) / AD_THRESHOLD) * 100} 
                  className="h-3 bg-black/40 [&>div]:bg-glowearn-gold" 
                />
              </div>

              <div className="space-y-6">
                <button 
                  onClick={handleWatchAd}
                  disabled={adTimer > 0}
                  className={cn(
                    "w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2",
                    adTimer > 0 
                      ? "bg-white/5 text-white/20 grayscale cursor-not-allowed" 
                      : "shimmer-btn text-glowearn-navy shadow-[0_15px_40px_rgba(250,219,59,0.3)] active:scale-95"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {adTimer > 0 ? <Loader2 className="animate-spin" size={24} /> : <PlayCircle size={24} />}
                    <span className="text-lg">{adTimer > 0 ? `Verifying... ${adTimer}s` : 'Watch Video Ad'}</span>
                  </div>
                  {!adTimer && <span className="text-[10px] opacity-70">Opens Smart Link</span>}
                </button>

                <p className="text-[10px] text-white/40 text-center font-bold uppercase leading-relaxed px-4">
                  Stay on the page for 15 seconds after opening the link to verify your activity and earn progress.
                </p>
              </div>

              {successMessage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-glowearn-navy/90 backdrop-blur-md rounded-[2.5rem] z-20 animate-in fade-in zoom-in duration-300 text-center px-6">
                  <Sparkles className="text-glowearn-gold w-16 h-16 animate-bounce mb-4" />
                  <h2 className="text-glowearn-gold font-headline text-2xl font-black italic uppercase tracking-tighter drop-shadow-[0_0_15px_#fadb3b]">
                    {successMessage}
                  </h2>
                </div>
              )}
            </Card>

            <div className="flex items-center gap-2 text-white/20 font-bold uppercase text-[9px] tracking-widest">
              <ShieldCheck size={12} />
              <span>Anti-Fraud System Active</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('menu')}
                className="flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-full transition-all"
              >
                <ChevronLeft size={16} /> Back to Menu
              </button>
              <div className="flex items-center gap-2 bg-glowearn-gold/10 px-4 py-2 rounded-full border border-glowearn-gold/20">
                <span className="text-glowearn-gold font-black italic text-sm">{score.toLocaleString()}</span>
                <span className="text-glowearn-gold/60 font-bold uppercase text-[9px] tracking-widest">Session</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-glowearn-gold font-headline text-3xl font-black italic tracking-[0.15em] uppercase">
                GLOW PUZZLE
              </h1>
            </div>

            <div 
              ref={boardRef}
              className="w-full aspect-square p-2 bg-[#0c2436]/80 rounded-[1.5rem] border-2 border-white/10 relative"
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
                          cell === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300",
                          cell === 2 && "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300",
                          cell === 3 && "bg-gradient-to-br from-red-400 to-red-600 border-red-300",
                          cell === 4 && "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300",
                          cell === 5 && "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300",
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
                  <h2 className="text-glowearn-gold font-headline text-4xl font-black italic uppercase tracking-tighter">LINE CLEAR!</h2>
                </div>
              )}

              {isGameOver && (
                <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-glowearn-navy/90 backdrop-blur-xl rounded-[1.5rem] animate-in fade-in duration-500">
                  <Trophy className="text-glowearn-gold w-16 h-16 animate-pulse mb-4" />
                  <h2 className="text-glowearn-gold font-headline text-4xl font-black italic uppercase mb-2">GAME OVER</h2>
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
              <div className="flex justify-around items-center w-full bg-[#0c2436]/60 p-6 rounded-[2.5rem] border border-white/5">
                {shelf.map((shape, idx) => (
                  <div 
                    key={idx}
                    onMouseDown={(e) => handleDragStart(e, idx)}
                    onTouchStart={(e) => handleDragStart(e, idx)}
                    className={cn(
                      "relative flex flex-col items-center justify-center h-20 w-20 rounded-2xl border transition-all cursor-grab active:cursor-grabbing",
                      dragState.index === idx ? "opacity-0" : "bg-black/30 border-white/5 hover:scale-105",
                      !shape && "opacity-0 pointer-events-none"
                    )}
                  >
                    {shape && (
                      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape.cells[0].length}, minmax(0, 1fr))` }}>
                        {shape.cells.flat().map((c: number, i: number) => (
                          <div 
                            key={i} 
                            className={cn("w-4 h-4 aspect-square rounded-[2px]", 
                              c !== 0 ? "bg-glowearn-gold" : "bg-transparent"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Drag Overlay */}
      {dragState.index !== null && shelf[dragState.index] && (
        <div 
          className="fixed pointer-events-none z-[200] scale-[1.2]"
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
                  c !== 0 ? "bg-glowearn-gold border-white/60" : "bg-transparent border-transparent"
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
