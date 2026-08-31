import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Capacitor } from '@capacitor/core';

interface BiometricLockProps {
  onUnlock: () => void;
}

export function BiometricLock({ onUnlock }: BiometricLockProps) {
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    if (!Capacitor.isNativePlatform()) {
      // In web, just unlock immediately if native isn't available
      onUnlock();
      return;
    }
    try {
      const info = await BiometricAuth.checkBiometry();
      if (info.isAvailable) {
        setCanUseBiometric(true);
        handleAuthenticate();
      } else {
        // Biometric not available, just unlock
        onUnlock();
      }
    } catch (e) {
      console.error(e);
      onUnlock();
    }
  };

  const handleAuthenticate = async () => {
    setVerifying(true);
    setError('');
    try {
      const result = await BiometricAuth.authenticate({
        reason: 'Unlock SanFlix-Pro',
        cancelTitle: 'Cancel',
        allowDeviceCredential: true
      });
      if ((result as any).hasAuthenticated) {
        onUnlock();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Authentication failed');
    } finally {
      setVerifying(false);
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return null; // Will auto unlock in checkBiometrics
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-600/5 blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl"
      >
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-600/10 border border-zinc-800">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2">App Locked</h1>
        <p className="text-zinc-400 text-center text-sm mb-8">
          Verify your identity to open SanFlix-Pro securely.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-6 bg-red-500/10 px-4 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleAuthenticate}
          disabled={verifying}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors active:scale-95 shadow-lg shadow-red-600/20"
        >
          <Fingerprint className="w-6 h-6" />
          {verifying ? 'Verifying...' : 'Use Fingerprint / PIN'}
        </button>
      </motion.div>
    </div>
  );
}
