
import React from 'react';
import { cn } from "@/lib/utils";

interface GoldenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GoldenButton({ children, className, ...props }: GoldenButtonProps) {
  return (
    <button
      className={cn(
        "w-full rounded-2xl py-4 px-6 text-glowearn-navy font-headline font-black text-lg uppercase tracking-widest shadow-[0_8px_30px_rgb(250,219,59,0.3)] transition-transform active:scale-95 shimmer-btn",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
}
