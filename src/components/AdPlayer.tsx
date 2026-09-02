import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlaySquare, Volume2, ShieldCheck } from 'lucide-react';

interface AdPlayerProps {
  onAdComplete: () => void;
}

export function AdPlayer({ onAdComplete }: AdPlayerProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
        <span className="text-white text-xs font-bold tracking-wider">Sponsor Ad</span>
      </div>
      
      {timeLeft > 0 ? (
        <div className="absolute top-4 right-4 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg">
          Ad ends in {timeLeft}s
        </div>
      ) : (
        <button 
          onClick={onAdComplete}
          className="absolute top-4 right-4 bg-white hover:bg-zinc-200 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          Skip Ad <PlaySquare className="w-4 h-4" />
        </button>
      )}
      
      <div className="flex flex-col items-center justify-center max-w-sm text-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center mb-6 border border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
           <ShieldCheck className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">SanFlix Premium Sponsor</h2>
        <p className="text-zinc-400 text-sm">
          Please wait while this sponsor message plays. You will be rewarded with 10 minutes of premium access.
        </p>
      </div>

      <div className="absolute bottom-10 left-10 flex gap-2">
         <Volume2 className="w-5 h-5 text-white/50" />
      </div>
    </div>
  );
}
