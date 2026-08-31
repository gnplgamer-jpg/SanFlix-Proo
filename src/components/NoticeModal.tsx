import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the popup in this session
    const isDismissed = sessionStorage.getItem('sanflix_notice_dismissed');
    if (!isDismissed) {
      // Show the popup after a short delay (e.g., 1.5 seconds)
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('sanflix_notice_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#222] to-[#111] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 border-b-2 border-zinc-800"
          >
            <div className="flex flex-col items-center text-center gap-4">
              
              {/* Header with X and Red Text */}
              <div className="flex items-start sm:items-center justify-center gap-2">
                <button 
                  onClick={handleClose} 
                  className="text-[#ffcc00] hover:text-yellow-300 transition-colors mt-1 sm:mt-0 shrink-0"
                  title="Close Notice"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={3} />
                </button>
                <h2 className="text-[#ff4d4d] text-xl sm:text-3xl font-semibold leading-tight tracking-wide">
                  Avoid FAKE Copies of SanFlix-Pro on Google,
                </h2>
              </div>

              {/* Body Text */}
              <p className="text-white text-lg sm:text-2xl font-medium leading-relaxed max-w-xl mx-auto">
                Always use <span className="text-[#3399ff]">SanFlix.Pro | SanFlix.App</span> With VPN to get Official Domain & Follow us on <a href="https://whatsapp.com/channel/0029Vb8YSYCIHphOoc4WCj2y" target="_blank" rel="noopener noreferrer" className="text-[#3399ff] hover:underline cursor-pointer">WhatsApp</a>
                {' '}
                <span className="text-[#ffcc00] block sm:inline mt-2 sm:mt-0">For Latest Updates.</span>
              </p>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
