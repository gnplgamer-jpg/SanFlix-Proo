import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Loader2, ShieldCheck, UserCircle2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const guestId = localStorage.getItem('sanflix_guest_id') || Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sanflix_guest_id', guestId);
      
      const user = {
        uid: guestId,
        displayName: name.trim() || 'Guest User',
        isGuest: true
      };
      
      localStorage.setItem('sanflix_user', JSON.stringify(user));
      onSuccess(user);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col mb-8">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Welcome to SanFlix</h2>
          <p className="text-zinc-400 text-sm">Enter your name or continue as a guest to unlock free streaming access and earn coins.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-red-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCircle2 className="w-5 h-5" />}
          {name.trim() ? 'Continue' : 'Continue as Guest'}
        </button>
        
        <p className="text-center text-zinc-500 text-xs mt-6">
          Your coins and progress will be saved securely on this device.
        </p>
      </motion.div>
    </div>
  );
}
