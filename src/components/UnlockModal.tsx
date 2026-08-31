import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Lock, Clock, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface UnlockModalProps {
  movie: any;
  coins: number;
  onClose: () => void;
  onUnlock: () => Promise<void>;
  onGoToSpinner: () => void;
  expiringSoon?: { title: string, timeLeft: string }[];
}

export function UnlockModal({ movie, coins, onClose, onUnlock, onGoToSpinner, expiringSoon }: UnlockModalProps) {
  const [unlocking, setUnlocking] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnlock = async () => {
    if (coins < 1) {
      onGoToSpinner();
      return;
    }
    setUnlocking(true);
    await onUnlock();
    setSuccess(true);
    setTimeout(() => {
      onClose(); // Parent should handle playing the movie after unlock
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative h-48 w-full">
          <img 
            src={movie.thumbnail_url || movie.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80"} 
            alt="Movie poster" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-zinc-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">Premium Content</h2>
            </div>
            <p className="text-zinc-300 text-sm truncate">{movie.title || movie.name}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
            <div>
              <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Your Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-black text-white">{coins} Coins</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Unlock Cost</p>
              <div className="flex items-center justify-end gap-1">
                <span className="text-xl font-bold text-white">1</span>
                <span className="text-zinc-500 font-medium">Coin</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Clock className="w-5 h-5 text-emerald-500" />
              <p>Full access unlocked for <strong className="text-white">6 Hours</strong></p>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <p>Watch as many times as you want</p>
            </div>
          </div>

          {expiringSoon && expiringSoon.length > 0 && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-red-400 mb-2 uppercase">Expiring Soon</p>
              {expiringSoon.map((exp, i) => (
                <div key={i} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                  <span className="text-zinc-300 truncate pr-4">{exp.title}</span>
                  <span className="text-red-400 whitespace-nowrap">{exp.timeLeft} left</span>
                </div>
              ))}
            </div>
          )}

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-emerald-500/20 text-emerald-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Unlocked Successfully!
            </motion.div>
          ) : (
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition ${
                coins >= 1 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/25' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {unlocking ? (
                <span className="animate-pulse">Unlocking...</span>
              ) : coins >= 1 ? (
                <>Unlock Now for 1 Coin</>
              ) : (
                <>Not enough coins. Get more!</>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
