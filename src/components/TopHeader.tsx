import { Search, Zap, PlayCircle, X, Sun, Moon, Mic, Check, Diamond, ShoppingCart, Gift, MessageSquarePlus, Coins, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface TopHeaderProps {
  onSearch: (query: string) => void;
  isSearchActive: boolean;
  setIsSearchActive: (val: boolean) => void;
  searchQuery: string;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
  onSearchFocus?: (isFocused: boolean) => void;
  onSearchSubmit?: (query: string) => void;
  onCartClick?: () => void;
  onGamesClick?: () => void;
  onResumeLatest?: () => void;
  hasContinueWatching?: boolean;
  coins?: number;
  onCoinClick?: () => void;
}

export function TopHeader({ onSearch, isSearchActive, setIsSearchActive, searchQuery, isLightMode, setIsLightMode, onSearchFocus, onSearchSubmit, onCartClick, onResumeLatest, onGamesClick, hasContinueWatching, coins = 0, onCoinClick }: TopHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [voiceConfirmation, setVoiceConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startVoiceRecognition = async () => {
    setVoiceError('');
    setVoiceTranscript('');
    setVoiceConfirmation(false);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    try {
      // Prompt for permission explicitly, which fixes the silent 'not-allowed' error in some iframe contexts
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setVoiceError("Microphone access needed for voice search.");
      setTimeout(() => setVoiceError(''), 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      onSearch(''); // Clear previous search
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setVoiceTranscript(currentTranscript);
      onSearch(currentTranscript);
      
      // If the result is final, show the confirmation banner
      if (event.results[0].isFinal) {
        setVoiceConfirmation(true);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Voice search error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError("Microphone access is blocked in settings.");
      } else if (event.error === 'no-speech') {
        setVoiceError("No speech detected. Try again.");
      } else {
        // Silently ignore other minor errors to avoid annoying the user
        console.warn(`Voice search error: ${event.error}`);
      }
      
      // Auto-clear error after 3 seconds
      setTimeout(() => setVoiceError(''), 4000);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!voiceConfirmation && voiceTranscript) { 
        setVoiceConfirmation(true);
      }
    };

    recognition.start();
  };

  const confirmVoiceSearch = () => {
    if (onSearchSubmit) onSearchSubmit(searchQuery);
    setVoiceConfirmation(false);
    setVoiceTranscript('');
  };

  const cancelVoiceSearch = () => {
    onSearch('');
    setVoiceConfirmation(false);
    setVoiceTranscript('');
  };


  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
      onSearchFocus?.(true);
    }
  }, [isSearchActive]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_NOTIFICATIONS');
      if (saved) setNotifications(JSON.parse(saved));
      const has = localStorage.getItem('SANFLIX_HAS_NEW_NOTS');
      if (has === 'true') setHasNew(true);
    } catch(e) {}

    // Global function for Sketchware Pro bridge
    (window as any).addNewNotification = (title: string, movieId?: string) => {
      const newNotif = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
        title,
        movieId: movieId || null,
        date: new Date().toISOString()
      };
      
      setNotifications(prev => {
        const updated = [newNotif, ...prev].slice(0, 15);
        try {
          localStorage.setItem('SANFLIX_NOTIFICATIONS', JSON.stringify(updated));
        } catch(e) {}
        return updated;
      });
      
      setHasNew(true);
      try {
        localStorage.setItem('SANFLIX_HAS_NEW_NOTS', 'true');
      } catch(e) {}
    };

    // Close panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenPanel = () => {
    setShowPanel(!showPanel);
    if (!showPanel) {
      setHasNew(false);
      try {
        localStorage.setItem('SANFLIX_HAS_NEW_NOTS', 'false');
      } catch(e) {}
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setHasNew(false);
    try {
      localStorage.removeItem('SANFLIX_NOTIFICATIONS');
      localStorage.setItem('SANFLIX_HAS_NEW_NOTS', 'false');
    } catch(e) {}
  };

  const handleNotificationClick = (notif: any) => {
    setShowPanel(false);
    
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notif.id);
      try {
        localStorage.setItem('SANFLIX_NOTIFICATIONS', JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });

    if (notif.movieId) {
      window.dispatchEvent(new CustomEvent('sanflix-open-movie', { detail: { id: notif.movieId }}));
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md pb-2" ref={dropdownRef}>
      {/* Voice Error Toast */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 bg-red-500/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between"
          >
            <span>{voiceError}</span>
            <button onClick={() => setVoiceError('')} className="p-1 hover:bg-white/20 rounded">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-4 pt-3 pb-2 h-14">
        <AnimatePresence mode="wait">
          {!isSearchActive ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-400 flex items-center justify-center p-[2px] cursor-pointer hover:scale-110 transition-transform" onClick={onResumeLatest} title="Resume Last Video">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                </div>
              </div>
              <div className="text-xl font-semibold tracking-tight">
                <span className="text-blue-400">San</span>Flix <span className="text-yellow-500 italic font-bold text-lg">-Pro</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 flex items-center bg-zinc-900 rounded-full border border-zinc-800 px-3 py-1.5 mr-3"
            >
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onFocus={() => onSearchFocus?.(true)}
                onBlur={() => setTimeout(() => onSearchFocus?.(false), 200)}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     onSearchSubmit?.(searchQuery);
                     inputRef.current?.blur();
                  }
                }}
                placeholder={isListening ? "Listening..." : "Movies, shows and more..."}
                className="bg-transparent border-none outline-none text-sm px-3 flex-1 text-white placeholder:text-zinc-500"
              />
              <button 
                onClick={startVoiceRecognition}
                className={`p-1 shrink-0 transition-all ${isListening ? 'text-red-500 bg-red-500/10 rounded-full scale-110' : 'text-zinc-400 hover:text-white'}`}
                title="Voice Search"
              >
                <motion.div animate={isListening ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Mic className="w-4 h-4" />
                </motion.div>
              </button>
              {searchQuery && !isListening && (
                <button onClick={() => onSearch('')} className="p-1 shrink-0">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 shrink-0">
          
          {!isSearchActive && (
            <button
              onClick={onGamesClick}
              className="w-9 h-9 preserve-color rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
              title="GMS"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchActive(!isSearchActive)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isSearchActive ? 'bg-zinc-800 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
            }`}
          >
            {isSearchActive ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          
          {!isSearchActive && (
            <>


              <button 
                onClick={() => setIsLightMode(!isLightMode)}
                className="w-9 h-9 preserve-color rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-500">
                {isLightMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 fill-current" />}
              </button>
              
              {/* Coin Button */}
              <button 
                onClick={onCoinClick}
                className="h-9 px-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 border border-yellow-400/50 flex items-center justify-center text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform"
              >
                <div className="flex items-center font-bold text-sm">
                  <Coins className="w-4 h-4 mr-1" />
                  {coins}
                </div>
              </button>

              {/* Shopping Cart */}
              <button 
                onClick={onCartClick}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-rose-500 border border-red-400/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Voice Search Confirmation Overlay */}
      <AnimatePresence>
        {voiceConfirmation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 overflow-hidden"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3 mt-1 shadow-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-400 mb-0.5">Recognized:</p>
                <p className="text-sm text-white font-medium truncate">"{voiceTranscript}"</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={cancelVoiceSearch}
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={confirmVoiceSearch}
                  className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
}
