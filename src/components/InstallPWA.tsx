import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install on iOS: Tap the Share icon at the bottom, then tap 'Add to Home Screen'.");
      } else {
        alert("To install: Tap the 3-dot menu in your browser and select 'Install App' or 'Add to Home Screen'.");
      }
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstallable(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };



  return (
    <button 
      onClick={handleInstallClick}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-600/20 to-rose-500/10 border border-red-500/30 rounded-2xl hover:bg-red-500/20 transition-colors mt-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
          <Download className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-left">
          <h3 className="text-white font-bold text-sm">Install App</h3>
          <p className="text-xs text-zinc-400">Add SanFlix to Home Screen</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg">
        Install
      </div>
    </button>
  );
}
