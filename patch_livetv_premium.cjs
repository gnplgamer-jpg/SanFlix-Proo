const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

if (!code.includes('interface LiveTvScreenProps')) {
  code = code.replace('export function LiveTvScreen() {', `interface LiveTvScreenProps {
  user?: any;
  onRequirePremium?: (expired: boolean) => void;
}

export function LiveTvScreen({ user, onRequirePremium }: LiveTvScreenProps) {`);
}

// Add state for trial time left
const stateAnchor = "const [searchQuery, setSearchQuery] = useState('');";
const newStates = `const [searchQuery, setSearchQuery] = useState('');
  const [trialTimeLeft, setTrialTimeLeft] = useState<number | null>(null);`;
if (!code.includes('trialTimeLeft')) {
  code = code.replace(stateAnchor, newStates);
}

// The core check loop for trial
const effectAnchor = "const hlsRef = useRef<Hls | null>(null);";
const checkLoop = `const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const isPremium = user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true';
    if (isPremium) {
       setTrialTimeLeft(null);
       return;
    }

    const checkTrial = () => {
       const expiryStr = localStorage.getItem('SANFLIX_LIVE_TRIAL_EXPIRY');
       if (!expiryStr) {
          // No trial started
          setTrialTimeLeft(0);
          if (isPlaying && onRequirePremium) {
             videoRef.current?.pause();
             setIsPlaying(false);
             onRequirePremium(false);
          }
          return;
       }
       
       const expiry = parseInt(expiryStr);
       const now = Date.now();
       if (now >= expiry) {
          // Trial expired
          setTrialTimeLeft(0);
          if (isPlaying && onRequirePremium) {
             videoRef.current?.pause();
             setIsPlaying(false);
             onRequirePremium(true);
          }
       } else {
          setTrialTimeLeft(Math.floor((expiry - now) / 1000));
       }
    };

    checkTrial();
    const timer = setInterval(checkTrial, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, user, onRequirePremium]);
  
  // Format MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
  };
`;
if (!code.includes('setTrialTimeLeft(null)')) {
  code = code.replace(effectAnchor, checkLoop);
}

// Add the trial UI overlay in the video container
const videoContainerAnchor = `className="w-full h-full object-contain"
            />
          )}`;
const overlayCode = `className="w-full h-full object-contain"
            />
          )}

          {/* Premium / Trial Overlay */}
          {!playerError && currentChannel && trialTimeLeft !== null && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-yellow-500 tracking-wider">
                 Trial: {formatTime(trialTimeLeft)}
               </span>
            </div>
          )}

          {/* Block Overlay if expired/not started */}
          {!playerError && currentChannel && trialTimeLeft === 0 && !(user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true') && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
               <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 border border-yellow-500/30">
                 <Tv className="w-8 h-8 text-yellow-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Live TV is Locked</h3>
               <p className="text-sm text-zinc-400 mb-6 max-w-[250px]">Get a Premium subscription or watch an ad to start your 10-minute trial.</p>
               <button 
                 onClick={() => onRequirePremium && onRequirePremium(false)}
                 className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)]"
               >
                 Unlock Now
               </button>
            </div>
          )}`;
if (!code.includes('Live TV is Locked')) {
  code = code.replace(videoContainerAnchor, overlayCode);
}

// Modify channel selection
const channelSelectRegex = /const handleChannelSelect = \(channel: Channel\) => {[\s\S]*?};/m;
const newChannelSelect = `const handleChannelSelect = (channel: Channel) => {
    // If not premium and no active trial, show modal first
    const isPremium = user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true';
    if (!isPremium) {
       const expiryStr = localStorage.getItem('SANFLIX_LIVE_TRIAL_EXPIRY');
       if (!expiryStr || Date.now() >= parseInt(expiryStr)) {
          if (onRequirePremium) {
             onRequirePremium(!!expiryStr); // true if expired, false if first time
          }
       }
    }
    
    setPlayerError(false);
    setCurrentChannel(channel);
  };`;
code = code.replace(channelSelectRegex, newChannelSelect);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Patched LiveTvScreen.tsx');
