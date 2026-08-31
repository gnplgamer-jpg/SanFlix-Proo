const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// 1. Imports
if (!content.includes('CalendarCheck')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, CalendarCheck, Film, CheckCircle } from 'lucide-react';");
}

// 2. State
if (!content.includes('dailyCheckInClaimed')) {
    content = content.replace(
      /const \[cooldown, setCooldown\] = useState\(0\);/,
      `const [cooldown, setCooldown] = useState(0);
  const [adPurpose, setAdPurpose] = useState<'spin' | 'mission'>('spin');
  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState(false);
  const [trailerClaimed, setTrailerClaimed] = useState(false);`
    );
}

// 3. adTimer useEffect
content = content.replace(
  /\} else if \(showAd && adTimer === 0\) \{\s*setShowAd\(false\);\s*finishSpin\(\);\s*\}/,
  `} else if (showAd && adTimer === 0) {
      setShowAd(false);
      if (adPurpose === 'spin') {
        finishSpin();
      } else {
        onReward(20);
        setTrailerClaimed(true);
        localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
      }
    }`
);

// 4. Mission Logic
content = content.replace(
  /const DIRECT_AD_LINK = "https:\/\/omg10.com\/4\/10394106";/,
  `useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem('daily_checkin_' + today) === 'true') setDailyCheckInClaimed(true);
    if (localStorage.getItem('daily_trailer_' + today) === 'true') setTrailerClaimed(true);
  }, []);

  const handleClaimCheckIn = () => {
    if (dailyCheckInClaimed) return;
    playSound(clickSound);
    onReward(50);
    setDailyCheckInClaimed(true);
    localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true');
  };

  const handleTrailerMission = async () => {
    if (trailerClaimed || spinning || showAd) return;
    playSound(clickSound);

    try {
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    } catch (e) {
      setShowAdBlockerMsg(true);
      return;
    }

    if (Capacitor.isNativePlatform()) {
      try {
        setSpinning(true);
        await AdMob.prepareRewardVideoAd({
          adId: "ca-app-pub-8551073579787342/1909350132",
          isTesting: false
        });
        
        AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          onReward(20);
          setTrailerClaimed(true);
          localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          setSpinning(false);
        });
        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          triggerUnityAd('mission');
        });
        await AdMob.showRewardVideoAd();
      } catch (error) {
        console.error("AdMob Error", error);
        triggerUnityAd('mission');
      }
    } else {
      triggerWebAd('mission');
    }
  };

  const DIRECT_AD_LINK = "https://omg10.com/4/10394106";`
);

// 5. triggerWebAd updates
content = content.replace(
  /const triggerWebAd = \(\) => \{/,
  `const triggerWebAd = (purpose: 'spin' | 'mission' = 'spin') => {
    setAdPurpose(purpose);`
);

content = content.replace(
  /const triggerUnityAd = async \(\) => \{/,
  `const triggerUnityAd = async (purpose: 'spin' | 'mission' = 'spin') => {
    setAdPurpose(purpose);`
);

content = content.replace(
  /if \(result && result\.success\) \{\s*finishSpin\(\);\s*\} else \{\s*triggerWebAd\(\); \/\/ Ultimate fallback\s*\}/,
  `if (result && result.success) {
        if (purpose === 'spin') finishSpin();
        else {
          onReward(20);
          setTrailerClaimed(true);
          localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
        }
      } else {
        triggerWebAd(purpose); // Ultimate fallback
      }`
);

// Fix ultimate fallback calls in triggerUnityAd error block
content = content.replace(
  /\} catch \(e\) \{\s*console\.error\("UnityAds fallback error", e\);\s*triggerWebAd\(\); \/\/ Ultimate fallback\s*\}/,
  `} catch (e) {
      console.error("UnityAds fallback error", e);
      triggerWebAd(purpose); // Ultimate fallback
    }`
);


// 6. UI insertion
const missionJSX = `
        {/* Daily Missions Section */}
        <div className="w-full max-w-sm mt-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">Daily Missions</h3>
            <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-0.5 rounded">NEW</span>
          </div>
          
          {/* Check-in Mission */}
          <div className={\`bg-zinc-900 border \${dailyCheckInClaimed ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-4 flex items-center justify-between transition-all\`}>
            <div className="flex items-center gap-4">
              <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${dailyCheckInClaimed ? 'bg-green-500/10' : 'bg-zinc-800'}\`}>
                <CalendarCheck className={\`w-6 h-6 \${dailyCheckInClaimed ? 'text-green-500' : 'text-zinc-400'}\`} />
              </div>
              <div>
                <h4 className="text-white font-bold">Daily Check-in</h4>
                <p className="text-yellow-500 text-sm font-medium">+50 Coins</p>
              </div>
            </div>
            <button 
              onClick={handleClaimCheckIn}
              disabled={dailyCheckInClaimed}
              className={\`px-4 py-2 rounded-xl font-bold transition-all \${
                dailyCheckInClaimed 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
              }\`}
            >
              {dailyCheckInClaimed ? <CheckCircle className="w-5 h-5" /> : 'Claim'}
            </button>
          </div>

          {/* Watch Trailer Mission */}
          <div className={\`bg-zinc-900 border \${trailerClaimed ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-4 flex items-center justify-between transition-all\`}>
            <div className="flex items-center gap-4">
              <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${trailerClaimed ? 'bg-green-500/10' : 'bg-zinc-800'}\`}>
                <Film className={\`w-6 h-6 \${trailerClaimed ? 'text-green-500' : 'text-zinc-400'}\`} />
              </div>
              <div>
                <h4 className="text-white font-bold">Watch Trailer</h4>
                <p className="text-yellow-500 text-sm font-medium">+20 Coins</p>
              </div>
            </div>
            <button 
              onClick={handleTrailerMission}
              disabled={trailerClaimed || showAd || spinning}
              className={\`px-4 py-2 rounded-xl font-bold transition-all \${
                trailerClaimed 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
              }\`}
            >
              {trailerClaimed ? <CheckCircle className="w-5 h-5" /> : 'Watch'}
            </button>
          </div>
        </div>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<AnimatePresence>\s*\{showAd && \(/,
  missionJSX + "\n      </div>\n\n      <AnimatePresence>\n        {showAd && ("
);

// Fix ad close handler - when ad timer > 0, X button stops ad, we should make sure it clears state properly.
// The existing onClick={() => { setShowAd(false); finishSpin(); }} might trigger finishSpin improperly for mission.
content = content.replace(
  /onClick=\{\(\) => \{ setShowAd\(false\); finishSpin\(\); \}\}/,
  `onClick={() => { setShowAd(false); if (adPurpose === 'spin') finishSpin(); }}`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
