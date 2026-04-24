
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface GoldenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label?: string;
}

export function GoldenInput({ icon: Icon, label, className, ...props }: GoldenInputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-glowearn-gold/80 text-xs font-bold uppercase tracking-widest px-1">{label}</label>}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-glowearn-gold/60 group-focus-within:text-glowearn-gold transition-colors" />
        </div>
        <input
          className={cn(
            "block w-full bg-glowearn-navy/50 border border-glowearn-gold/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-glowearn-gold golden-glow",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
