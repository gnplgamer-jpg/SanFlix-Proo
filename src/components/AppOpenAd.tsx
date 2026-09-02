import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function AppOpenAd() {
  const [show, setShow] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    // Only show once per session
    const hasSeen = sessionStorage.getItem('SANFLIX_APP_OPEN_AD');
    if (!hasSeen) {
      setTimeout(() => setShow(true), 1500); // Show slightly after load
    }
  }, []);

  useEffect(() => {
    if (show) {
      sessionStorage.setItem('SANFLIX_APP_OPEN_AD', 'true');
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Load AdSense
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {}

      return () => clearInterval(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-bold uppercase tracking-wider border border-white/10">
              Advertisement
            </div>
            
            {canSkip ? (
              <button 
                onClick={() => setShow(false)}
                className="bg-black/50 hover:bg-black/80 backdrop-blur-md p-2 rounded-full text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-white font-bold border border-white/10">
                Skip in {timeLeft}s
              </div>
            )}
          </div>
          
          {/* Ad Container */}
          <div className="w-full h-full flex items-center justify-center pt-16 pb-4 px-4">
             <ins 
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-8551073579787342" 
                data-ad-slot="4295463025"
                data-ad-format="auto"
                data-full-width-responsive="true"
             ></ins>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
