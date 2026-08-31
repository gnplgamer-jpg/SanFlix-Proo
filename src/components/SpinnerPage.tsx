import { Capacitor } from "@capacitor/core";
import { AdMob, RewardAdPluginEvents } from "@capacitor-community/admob";
import { UnityAds } from "capacitor-unity-ads";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Coins, PlayCircle, Loader2, AlertTriangle, CalendarCheck, Film, CheckCircle } from 'lucide-react';

interface SpinnerPageProps {
  onClose: () => void;
  onReward: (coins: number) => Promise<void>;
  currentCoins: number;
}

const SEGMENTS = [
  { type: 'coin', value: 10, color: '#f59e0b', label: '10 Coins' },
  { type: 'ad', value: 0, color: '#ef4444', label: '🎁 Mystery Ad' },
  { type: 'coin', value: 5, color: '#10b981', label: '5 Coins' },
  { type: 'ad', value: 0, color: '#ef4444', label: '🎁 Mystery Ad' },
  { type: 'coin', value: 3, color: '#3b82f6', label: '3 Coins' },
  { type: 'ad', value: 0, color: '#ef4444', label: '🎁 Mystery Ad' },
  { type: 'coin', value: 2, color: '#8b5cf6', label: '2 Coins' },
  { type: 'ad', value: 0, color: '#ef4444', label: '🎁 Mystery Ad' },
  { type: 'coin', value: 0, color: '#6b7280', label: '0 Coins' },
  { type: 'ad', value: 0, color: '#ef4444', label: '🎁 Mystery Ad' },
];

export function SpinnerPage({ onClose, onReward, currentCoins }: SpinnerPageProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [showAdBlockerMsg, setShowAdBlockerMsg] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [spinResult, setSpinResult] = useState<any>(null);
  const [cooldown, setCooldown] = useState(0);
  const [adPurpose, setAdPurpose] = useState<'spin' | 'mission' | 'checkin'>('spin');
  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState(false);
  const [trailerClaimed, setTrailerClaimed] = useState(false);
  
  // Audio Refs
  const DIRECT_AD_LINK = "https://www.google.com"; // TODO: Replace with Adsterra Direct Link
  const clickSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));
  const spinSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3'));
  const winSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'));
  const loseSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/3151/3151-preview.mp3'));

  useEffect(() => {
    // Preload sounds and set volumes
    clickSound.current.volume = 0.5;
    spinSound.current.volume = 0.3;
    winSound.current.volume = 0.6;
    loseSound.current.volume = 0.5;
    
    // Looping the spin sound
    spinSound.current.loop = true;
  }, []);
  
  // Removed game trailer
  useEffect(() => {
    let interval: any;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => setAdTimer(prev => prev - 1), 1000);
    } else if (showAd && adTimer === 0) {
      setShowAd(false);
      if (adPurpose === 'spin') {
        finishSpin();
      } else {
        onReward(20);
        setTrailerClaimed(true);
        localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
      }
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const playSound = (audioRef: React.MutableRefObject<HTMLAudioElement>) => {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play prevented', e));
    } catch(e) {}
  };

  const stopSound = (audioRef: React.MutableRefObject<HTMLAudioElement>) => {
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch(e) {}
  };

  useEffect(() => {
    // Expose function for Android Native Webview to call when ad finishes
    (window as any).onNativeAdCompleted = () => {
      finishSpin();
    };
    
    return () => {
      delete (window as any).onNativeAdCompleted;
    };
  }, []);

  const triggerWebAd = (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {
    setAdPurpose(purpose);
    if (DIRECT_AD_LINK && DIRECT_AD_LINK.includes("http")) {
      window.open(DIRECT_AD_LINK, '_blank');
    }
    setShowAd(true);
    setAdTimer(10); // Show "Verifying Sponsor" screen for 10 seconds
  };

  const triggerUnityAd = async (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {
    setAdPurpose(purpose);
    try {
      setSpinning(true);
      await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
      const result = await UnityAds.showRewardedVideo();
      if (result && result.success) {
        if (purpose === 'spin') { finishSpin(); }
        else if (purpose === 'checkin') {
          onReward(15);
          setDailyCheckInClaimed(true);
          localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true');
        } else {
          onReward(20);
          setTrailerClaimed(true);
          localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
        }
      } else {
        triggerWebAd(purpose); // Ultimate fallback
      }
    } catch (e) {
      console.error("UnityAds fallback error", e);
      triggerWebAd(purpose); // Ultimate fallback
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem('daily_checkin_' + today) === 'true') setDailyCheckInClaimed(true);
    if (localStorage.getItem('daily_trailer_' + today) === 'true') setTrailerClaimed(true);
  }, []);

  const handleClaimCheckIn = async () => {
    if (dailyCheckInClaimed || spinning || showAd) return;
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
          onReward(15);
          setDailyCheckInClaimed(true);
          localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true');
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          setSpinning(false);
        });
        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          triggerUnityAd('checkin');
        });
        await AdMob.showRewardVideoAd();
      } catch (error) {
        console.error("AdMob Error", error);
        triggerUnityAd('checkin');
      }
    } else {
      triggerWebAd('checkin');
    }
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

  const handleSpinClick = async () => {
    if (spinning || showAd || cooldown > 0) return;
    playSound(clickSound);

    // Ad-blocker detection
    try {
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
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
          finishSpin();
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          setSpinning(false);
        });
        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          // If AdMob fails (e.g. not on Play Store), fallback to Unity Ads
          triggerUnityAd();
        });
        await AdMob.showRewardVideoAd();
      } catch (error) {
        console.error("AdMob Error", error);
        triggerUnityAd(); // Fallback
      }
    } else if (typeof (window as any).AndroidApp !== "undefined" && typeof (window as any).AndroidApp.showRewardedAd === "function") {
       (window as any).AndroidApp.showRewardedAd();
    } else if (typeof (window as any).SanFlixNativeBridge !== "undefined" && typeof (window as any).SanFlixNativeBridge.triggerAdUnlock === "function") {
       (window as any).SanFlixNativeBridge.triggerAdUnlock();
    } else {
      triggerWebAd();
    }
  };

  const finishSpin = () => {
    setSpinning(true);
    setSpinResult(null);
    playSound(spinSound); // Start spinner sound
    
    const randomSeed = Math.random();
    let targetIndex = 8; // default 0 coins
    
    if (randomSeed > 0.95) targetIndex = 0; 
    else if (randomSeed > 0.85) targetIndex = 2; 
    else if (randomSeed > 0.65) targetIndex = 4; 
    else if (randomSeed > 0.40) targetIndex = 6; 
    else if (randomSeed > 0.20) targetIndex = 1; 
    else targetIndex = 8; 

    const segmentDegree = 360 / SEGMENTS.length;
    const spins = 5;
    const extraDegrees = 360 - (targetIndex * segmentDegree); 
    const finalRotation = rotation + (spins * 360) + extraDegrees - (rotation % 360);

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      stopSound(spinSound); // Stop spinner sound
      
      const result = SEGMENTS[targetIndex];
      setSpinResult(result);
      
      if (result.type === 'coin' && result.value > 0) {
        playSound(winSound);
        onReward(result.value);
      } else if (result.type === 'ad') {
        playSound(winSound);
        onReward(1);
        result.label = "Mystery Reward: 1 Coin!";
      } else {
        playSound(loseSound);
      }
      setCooldown(5); 
    }, 4000); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950">
      <div className="p-4 flex items-center justify-between bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">Lucky Spin</h1>
            <p className="text-sm text-yellow-500 font-medium">Earn Free Coins</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-zinc-800">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-white">{currentCoins} Coins</span>
          </div>
          <button onClick={() => { playSound(clickSound); onClose(); }} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center relative">
        <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] mb-12">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-xl" />
          
          <div 
            className="w-full h-full rounded-full border-4 border-zinc-800 overflow-hidden shadow-2xl shadow-yellow-500/10 relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.85,0.3,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SEGMENTS.map((seg, i) => {
              const rot = i * 36;
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-1/2 w-[40px] h-1/2 origin-bottom -translate-x-1/2"
                  style={{ 
                    transform: `rotate(${rot}deg)`,
                    backgroundColor: seg.color,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    width: '110px'
                  }}
                >
                  <div className="pt-4 text-white font-bold text-sm text-center drop-shadow-md flex flex-col items-center gap-1">
                    {seg.type === 'coin' ? <Coins className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    {seg.value > 0 ? seg.value : (seg.type==='ad'?'AD':'0')}
                  </div>
                </div>
              );
            })}
            <div className="absolute inset-0 rounded-full border-[12px] border-zinc-900/50 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-900 border-4 border-zinc-800 rounded-full z-10 flex items-center justify-center shadow-inner">
              <Gift className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm text-center space-y-4">
          <button 
            onClick={handleSpinClick}
            disabled={spinning || showAd || cooldown > 0}
            className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all shadow-xl ${
              spinning || showAd || cooldown > 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black shadow-amber-500/20 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {cooldown > 0 ? (
              <>Wait {cooldown}s</>
            ) : spinning ? (
              <span className="animate-pulse">Spinning...</span>
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                SPIN TO WIN
              </>
            )}
          </button>
          <p className="text-zinc-500 text-sm font-medium">Watch a short sponsored video to spin!</p>
        
        {/* Daily Missions Section */}
        <div className="w-full max-w-sm mt-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">Daily Missions</h3>
            <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-0.5 rounded">NEW</span>
          </div>
          
          {/* Check-in Mission */}
          <div className={`bg-zinc-900 border ${dailyCheckInClaimed ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-4 flex items-center justify-between transition-all`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dailyCheckInClaimed ? 'bg-green-500/10' : 'bg-zinc-800'}`}>
                <CalendarCheck className={`w-6 h-6 ${dailyCheckInClaimed ? 'text-green-500' : 'text-zinc-400'}`} />
              </div>
              <div>
                <h4 className="text-white font-bold">VIP Check-in</h4>
                <p className="text-yellow-500 text-sm font-medium">+15 Coins (Ad)</p>
              </div>
            </div>
            <button 
              onClick={handleClaimCheckIn}
              disabled={dailyCheckInClaimed}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                dailyCheckInClaimed 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
              }`}
            >
              {dailyCheckInClaimed ? <CheckCircle className="w-5 h-5" /> : 'Claim'}
            </button>
          </div>

          {/* Watch Trailer Mission */}
          <div className={`bg-zinc-900 border ${trailerClaimed ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-4 flex items-center justify-between transition-all`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trailerClaimed ? 'bg-green-500/10' : 'bg-zinc-800'}`}>
                <Film className={`w-6 h-6 ${trailerClaimed ? 'text-green-500' : 'text-zinc-400'}`} />
              </div>
              <div>
                <h4 className="text-white font-bold">Watch Trailer</h4>
                <p className="text-yellow-500 text-sm font-medium">+20 Coins (Ad)</p>
              </div>
            </div>
            <button 
              onClick={handleTrailerMission}
              disabled={trailerClaimed || showAd || spinning}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                trailerClaimed 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
              }`}
            >
              {trailerClaimed ? <CheckCircle className="w-5 h-5" /> : 'Watch'}
            </button>
          </div>
        </div>

      </div>
      </div>
      <AnimatePresence>
        {showAd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            {/* Ad Header */}
            <div className="w-full h-14 flex justify-between items-center px-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <span className="text-zinc-400 text-xs font-bold px-2 py-1 bg-zinc-800 rounded">Advertisement</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 text-sm font-medium">
                  {adTimer > 0 ? `Reward in ${adTimer}s` : 'Reward granted'}
                </span>
                <button 
                  disabled={adTimer > 0} 
                  onClick={() => { setShowAd(false); if (adPurpose === 'spin') { finishSpin(); } else if (adPurpose === 'checkin') { onReward(15); setDailyCheckInClaimed(true); localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true'); } else { onReward(20); setTrailerClaimed(true); localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true'); } }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white transition-opacity ${adTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-zinc-700'}`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* VIP Ad Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="z-10 flex flex-col items-center text-center max-w-sm">
                <div className="w-28 h-28 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-1 mb-6 shadow-2xl shadow-red-600/40 flex items-center justify-center">
                   <div className="w-full h-full bg-black rounded-[26px] flex items-center justify-center">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-700 tracking-tighter">SF</span>
                   </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">SanFlix <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">VIP</span></h2>
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-[280px]">
                  Unlock ad-free movies, 4K streaming, and watch without interruptions.
                </p>
                
                <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl font-bold text-lg text-white shadow-lg shadow-red-600/30 animate-pulse active:scale-95 transition-transform">
                  Upgrade Now
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 bg-zinc-900 shrink-0">
              <motion.div 
                className="h-full bg-red-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {spinResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-[150] bg-zinc-900 border border-zinc-700 p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-auto"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
              {spinResult.type === 'coin' ? <Coins className="w-10 h-10 text-white" /> : <Gift className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {spinResult.type === 'coin' && spinResult.value > 0 ? `You won ${spinResult.value} Coins!` : 
               spinResult.type === 'ad' ? 'Mystery Reward! 1 Coin' : 
               'Better luck next time!'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {spinResult.value > 0 || spinResult.type === 'ad' 
                ? "Your balance has been updated." 
                : "No coins this time. Spin again to win!"}
            </p>
            <button 
              onClick={() => { playSound(clickSound); setSpinResult(null); }}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition"
            >
              Awesome
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    
      <AnimatePresence>
        {showAdBlockerMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ad-Blocker Detected</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Please disable your ad-blocker to support SanFlix. We rely on ads to keep our streaming service free and provide you with daily coins.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowAdBlockerMsg(false)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                >
                  I've disabled it (Retry)
                </button>
                <button 
                  onClick={() => setShowAdBlockerMsg(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
