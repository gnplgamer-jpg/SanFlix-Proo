import React from 'react';
import { motion } from 'motion/react';
import { Play, BellRing, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface SubscribeModalProps {
  onSubscribe: () => void;
  onClose: () => void;
}

export function SubscribeModal({ onSubscribe, onClose }: SubscribeModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-zinc-900 border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
        
        <div className="relative p-8 text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative">
             <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
             <div className="relative w-full h-full bg-gradient-to-tr from-red-700 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 border-4 border-zinc-900">
                <Play className="w-10 h-10 text-white ml-1 fill-white" />
             </div>
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">SanFlix-Pro</h2>
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mb-6 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700/50">
             <Users className="w-4 h-4 text-emerald-400" />
             <span className="text-sm">5,000,000 Subscribers</span>
          </div>
          
          <p className="text-zinc-300 text-sm mb-8 leading-relaxed px-4">
            Subscribe to our premium channel to unlock exclusive 4K content, smooth streaming, and unlimited ad-free viewing.
          </p>
          
          <button 
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-[1.02]"
          >
            <BellRing className="w-5 h-5 animate-pulse" />
            SUBSCRIBE NOW TO PLAY
          </button>
          
          <button 
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
