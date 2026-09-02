const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');

// 1. Update visualEnhancer state
code = code.replace(
  "const [visualEnhancer, setVisualEnhancer] = useState(false);",
  `const [visualEnhancer, setVisualEnhancer] = useState('Original');
  const [showVisualEnhancerPanel, setShowVisualEnhancerPanel] = useState(false);
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
          setVisualEnhancer('Original');
          setProTimeLeft(0);
        } else {
          setProTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [proUnlockEndTime]);

  const VISUAL_FILTERS = [
    { name: 'Original', css: 'none', isPro: false, img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { name: 'Clear', css: 'contrast(1.1) brightness(1.05)', isPro: false, img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e' },
    { name: 'HDR', css: 'contrast(1.25) saturate(1.3) brightness(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968' },
    { name: 'Ultra Clear', css: 'contrast(1.15) saturate(1.2) brightness(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f' },
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
             setVisualEnhancer(filter.name);
          } else {
             alert('Ad failed to load. Please try again.');
          }
        } else {
          // Web fallback
          setTimeout(() => {
            setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
            setVisualEnhancer(filter.name);
            setUnlockingFilter(null);
          }, 1500);
          return;
        }
      } catch (e) {
         console.error(e);
         // Auto unlock on error for fallback
         setProUnlockEndTime(Date.now() + 2 * 60 * 1000);
         setVisualEnhancer(filter.name);
      }
      setUnlockingFilter(null);
    } else {
      setVisualEnhancer(filter.name);
    }
  };`
);

// 2. Update style filter logic
code = code.replace(
  "filter: visualEnhancer ? 'saturate(1.3) contrast(1.15) brightness(1.05)' : 'none'",
  "filter: VISUAL_FILTERS.find(f => f.name === visualEnhancer)?.css || 'none'"
);

// 3. Update the enhance button
// Use a regex to capture the button
const buttonRegex = /<button[^>]*onClick=\{\(e\) => \{ e\.stopPropagation\(\); if \(!isLocked\) setVisualEnhancer\(!visualEnhancer\); \}\}[^>]*>[\s\S]*?<\/button>/;
const newButton = `                 <button 
                   onClick={(e) => { e.stopPropagation(); if (!isLocked) setShowVisualEnhancerPanel(true); }}
                   className={\`bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border flex items-center gap-2 px-3 \${visualEnhancer !== 'Original' ? 'bg-amber-500/30 border-amber-500/50' : 'border-white/10'}\`}
                 >
                   <Wand2 className={\`w-4 h-4 \${visualEnhancer !== 'Original' ? 'text-amber-400' : 'text-gray-400'}\`} />
                   <span className="text-xs font-bold hidden sm:inline">Enhance</span>
                 </button>`;
code = code.replace(buttonRegex, newButton);


// 4. Add the overlay panel at the bottom (inside the main wrapper)
const overlayPanel = `
      {/* Visual Enhancer Modal */}
      <AnimatePresence>
        {showVisualEnhancerPanel && (
          <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center px-4 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
              <button onClick={() => setShowVisualEnhancerPanel(false)} className="text-white p-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white ml-2">Visual Enhancer</h2>
            </div>
            
            {/* Filters Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
              {proUnlockEndTime && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mb-6 flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-lg"><Timer className="w-5 h-5 text-black" /></div>
                  <div>
                    <h3 className="text-amber-500 font-bold text-sm">PRO Unlocked</h3>
                    <p className="text-amber-500/80 text-xs">{Math.floor(proTimeLeft / 60000)}m {Math.floor((proTimeLeft % 60000) / 1000)}s remaining</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {VISUAL_FILTERS.map(filter => (
                  <div 
                    key={filter.name}
                    onClick={() => handleApplyFilter(filter)}
                    className={\`relative rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all \${visualEnhancer === filter.name ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-transparent hover:border-zinc-500'}\`}
                  >
                    <div className="aspect-[16/9] relative">
                      <img src={filter.img} alt={filter.name} className="w-full h-full object-cover" style={{ filter: filter.css }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <span className={\`font-bold text-sm \${visualEnhancer === filter.name ? 'text-amber-400' : 'text-white'}\`}>{filter.name}</span>
                      </div>
                      
                      {filter.isPro && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 rounded text-[10px] font-black text-white shadow-lg">
                          PRO
                        </div>
                      )}
                      
                      {unlockingFilter === filter.name && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin mb-1" />
                          <span className="text-xs text-amber-500 font-bold">Unlocking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer Apply Button */}
            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md flex justify-center">
               <button 
                 onClick={() => setShowVisualEnhancerPanel(false)}
                 className="w-full max-w-sm py-4 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition"
               >
                 Apply to all & Close
               </button>
            </div>
          </div>
        )}
      </AnimatePresence>
`;

code = code.replace(
  "{/* Swipe Indicator Overlay */}",
  overlayPanel + "\n      {/* Swipe Indicator Overlay */}"
);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
console.log('successfully implemented visual enhancer');
