const fs = require('fs');

const content = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, ExternalLink, MessageCircle } from 'lucide-react';

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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.7)]"
          >
            {/* Top glowing accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-10"
              title="Close Notice"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center mt-2">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <ShieldAlert className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                Important Notice
              </h2>
              
              <p className="text-zinc-300 text-lg sm:text-xl font-medium mb-7 leading-snug">
                Avoid <span className="text-red-500 font-black tracking-wide">FAKE</span> copies of SanFlix-Pro on Google.
              </p>

              <div className="w-full bg-black/40 rounded-2xl p-5 sm:p-6 border border-zinc-800/80 mb-6 shadow-inner">
                <p className="text-zinc-500 text-xs sm:text-sm mb-3 font-bold uppercase tracking-widest">
                  Always use Official Domain
                </p>
                <a 
                  href="https://sanflix-l.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/20 hover:to-blue-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 hover:text-indigo-300 transition-all group shadow-lg shadow-indigo-500/5"
                >
                  <span className="font-bold text-lg sm:text-xl tracking-wide">https://sanflix-l.ai.studio</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <p className="text-yellow-500/90 font-medium text-xs sm:text-sm mt-4 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                  Use with VPN for best experience
                </p>
              </div>

              <a
                href="https://whatsapp.com/channel/0029Vb8YSYCIHphOoc4WCj2y"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f776a] text-white font-black text-lg rounded-xl transition-colors shadow-xl shadow-[#25D366]/20 hover:scale-[1.02] transform duration-200"
              >
                <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
                Follow us on WhatsApp for Updates
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
`;

fs.writeFileSync('src/components/NoticeModal.tsx', content);
