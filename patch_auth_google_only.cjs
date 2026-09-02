const fs = require('fs');

const authModalCode = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = {
        uid: result.user.uid,
        displayName: result.user.displayName || 'User',
        email: result.user.email,
        isGuest: false,
        photoURL: result.user.photoURL
      };
      localStorage.setItem('sanflix_user', JSON.stringify(user));
      onSuccess(user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const guestId = localStorage.getItem('sanflix_guest_id') || Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sanflix_guest_id', guestId);
      
      const user = {
        uid: guestId,
        displayName: 'Guest User',
        isGuest: true
      };
      
      localStorage.setItem('sanflix_user', JSON.stringify(user));
      onSuccess(user);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
        
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-zinc-800/50 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8 text-center mt-2">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/30 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <ShieldCheck className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Unlock SanFlix
          </h2>
          <p className="text-zinc-400 text-sm max-w-[260px] leading-relaxed">
            Sign in securely with Google to sync your watchlist, save progress, and enjoy premium content.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <UserCircle2 className="w-5 h-5" />
            Continue as Guest
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-1.5 text-zinc-500 text-xs">
           <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
           No passwords to remember. Instant access.
        </div>
      </motion.div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/AuthModal.tsx', authModalCode);
console.log('Fixed Auth Modal to Google Only');
