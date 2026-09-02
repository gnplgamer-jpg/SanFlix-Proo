import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, ShieldCheck, X } from 'lucide-react';

interface AdPlayerProps {
  onAdComplete: () => void;
}

export function AdPlayer({ onAdComplete }: AdPlayerProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      {/* Unity Ads Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          {/* Unity Logo SVG Approximation */}
          <div className="w-6 h-6 flex flex-wrap gap-0.5 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M12.98 2.33c-.58-.33-1.38-.33-1.96 0L3.19 6.84c-.58.33-.98 1.02-.98 1.69v8.94c0 .67.4 1.36.98 1.69l7.83 4.51c.58.33 1.38.33 1.96 0l7.83-4.51c.58-.33.98-1.02.98-1.69V8.53c0-.67-.4-1.36-.98-1.69l-7.83-4.51zM12 16.5l-4-2.5v-5l4-2.5 4 2.5v5l-4 2.5z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold tracking-widest opacity-80">UNITY ADS</span>
        </div>
        
        <div className="flex items-center gap-4">
          {timeLeft > 0 ? (
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg">
              Reward in {timeLeft}
            </div>
          ) : (
            <div className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              Reward Granted!
            </div>
          )}
          
          {canClose && (
            <button 
              onClick={onAdComplete}
              className="bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
      
      {/* Video Content Simulation */}
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900">
         {/* Fake Ad Content (Sponsor) */}
         <div className="w-full h-full absolute inset-0 overflow-hidden">
            <img 
               src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-30 animate-pulse" 
               alt="ad bg" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
         </div>
         
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 max-w-sm"
         >
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
               <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Sponsored Content</h2>
            <p className="text-zinc-300 text-sm mb-6">
              Watch this video to unlock your Premium reward. Sponsored by Unity Ads (ID: 5996901).
            </p>
            
            {!canClose && (
               <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
               </div>
            )}
         </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 flex gap-2 z-10">
         <Volume2 className="w-5 h-5 text-white/50" />
      </div>
    </div>
  );
}
