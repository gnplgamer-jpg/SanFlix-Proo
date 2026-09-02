const fs = require('fs');
let code = `import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Lock, ShieldCheck, AlertCircle, Delete } from 'lucide-react';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Capacitor } from '@capacitor/core';

interface BiometricLockProps {
  onUnlock: () => void;
}

export function BiometricLock({ onUnlock }: BiometricLockProps) {
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [pin, setPin] = useState('');
  
  // The correct PIN is stored in localStorage or default to 1234
  const correctPin = localStorage.getItem('sanflix_pin') || '1234';

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    if (!Capacitor.isNativePlatform()) {
      return; // Fallback to PIN on web
    }
    try {
      const info = await BiometricAuth.checkBiometry();
      if (info.isAvailable) {
        handleAuthenticate();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthenticate = async () => {
    if (!Capacitor.isNativePlatform()) return;
    
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
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handlePinPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError('Incorrect PIN');
          setTimeout(() => {
            setPin('');
            setError('');
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-600/5 blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-zinc-950 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full shadow-2xl"
      >
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-600/10 border border-zinc-800">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2">App Locked</h1>
        <p className="text-zinc-400 text-center text-sm mb-6">
          Enter PIN to unlock (Default: 1234)
        </p>

        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={\`w-4 h-4 rounded-full border-2 \${pin.length > i ? 'bg-white border-white' : 'border-zinc-600'}\`} />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-6 bg-red-500/10 px-4 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handlePinPress(num)}
              className="w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-2xl font-bold flex items-center justify-center transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePinPress('0')}
            className="w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-2xl font-bold flex items-center justify-center transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-colors active:scale-95"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {Capacitor.isNativePlatform() && (
          <button
            onClick={handleAuthenticate}
            disabled={verifying}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors active:scale-95 border border-red-600/30"
          >
            <Fingerprint className="w-6 h-6" />
            {verifying ? 'Verifying...' : 'Use Biometrics'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/BiometricLock.tsx', code);
console.log('BiometricLock patched');
