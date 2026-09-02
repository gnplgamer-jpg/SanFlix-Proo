const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');

// Remove my previous bad patches if any
code = code.replace(/<video\s+style=\{\{ filter: filters\.find\(f => f\.name === activeFilter\)\?\.css \|\| 'none' \}\}\s+ref=\{videoRef\}/, '<video\n            ref={videoRef}');
// And remove the states I added previously
const badStates = `
  const [showVisualEnhancer, setShowVisualEnhancer] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Original');
  const [proUnlockEndTime, setProUnlockEndTime] = useState<number | null>(null);
  const [unlockingFilter, setUnlockingFilter] = useState<string | null>(null);
  const [proTimeLeft, setProTimeLeft] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (proUnlockEndTime) {
      interval = setInterval(() => {
        const remaining = proUnlockEndTime - Date.now();
        if (remaining <= 0) {
          setProUnlockEndTime(null);
          setActiveFilter('Original'); // Revert to original when time is up
          setProTimeLeft(0);
        } else {
          setProTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [proUnlockEndTime]);

  const filters = [
    { name: 'Original', css: 'none', isPro: false, img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { name: 'Clear', css: 'contrast(1.1) brightness(1.05)', isPro: false, img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e' },
    { name: 'HDR', css: 'contrast(1.25) saturate(1.3) brightness(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968' },
    { name: 'Ultra Clear', css: 'contrast(1.15) saturate(1.2) brightness(1.1) sharpness(1.2)', isPro: true, img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f' },
    { name: 'Arctic Blue', css: 'sepia(0.2) hue-rotate(180deg) saturate(1.5) contrast(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb' },
    { name: 'Warm Glow', css: 'sepia(0.4) saturate(1.4) contrast(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
    { name: 'Cinematic', css: 'contrast(1.2) saturate(0.8) sepia(0.2)', isPro: true, img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1' }
  ];

  const handleApplyFilter = async (filter: any) => {
    if (filter.isPro && !proUnlockEndTime) {
      setUnlockingFilter(filter.name);
      try {
        if ((window as any).Capacitor?.isNativePlatform()) {
          const { UnityAds } = require('capacitor-unity-ads');
          await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
          const result = await UnityAds.showRewardedVideo();
          if (result && result.success) {
             setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
             setActiveFilter(filter.name);
          } else {
             alert('Ad failed to load. Please try again.');
          }
        } else {
          // Web fallback
          setTimeout(() => {
            setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
            setActiveFilter(filter.name);
            setUnlockingFilter(null);
          }, 1500);
          return;
        }
      } catch (e) {
         console.error(e);
         // Auto unlock on error for fallback
         setProUnlockEndTime(Date.now() + 2 * 60 * 1000);
         setActiveFilter(filter.name);
      }
      setUnlockingFilter(null);
    } else {
      setActiveFilter(filter.name);
    }
  };
`;
code = code.replace(badStates, "");

// Replace the bad wand button block
const badWandBtn = `
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowVisualEnhancer(true); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Wand2 className={\`w-4 h-4 \${activeFilter !== 'Original' ? 'text-amber-400' : 'text-zinc-300'}\`} />
                      <span className="text-xs font-bold hidden sm:inline">Enhance</span>
                    </button>
`;
code = code.replace(badWandBtn, "");

const badPanelRegex = /\{\/\* Visual Enhancer Modal \*\/\}[\s\S]*?\<\/AnimatePresence\>/;
code = code.replace(badPanelRegex, "");

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
