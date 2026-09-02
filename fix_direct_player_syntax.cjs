const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');

const correctCode = `  const handleApplyFilter = async (filter: any) => {
    if (filter.isPro && !proUnlockEndTime) {
      setUnlockingFilter(filter.name);
      try {
        if ((window as any).Capacitor?.isNativePlatform()) {
          const { AdMob, RewardAdPluginEvents } = require('@capacitor-community/admob');
          const { UnityAds } = require('capacitor-unity-ads');
          const { AD_CONFIG } = require('../config/ads');

          try {
            // Try AdMob first
            AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
              setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
              setVisualEnhancer(filter.name);
            });
            await AdMob.prepareRewardVideoAd({ adId: AD_CONFIG.admob.rewarded, isTesting: false });
            await AdMob.showRewardVideoAd();
          } catch(admobErr) {
            console.error("AdMob Rewarded Error", admobErr);
            try {
              // Fallback to UnityAds
              await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
              const result = await UnityAds.showRewardedVideo();
              if (result && result.success) {
                 setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
                 setVisualEnhancer(filter.name);
              } else {
                 alert('Ad failed to load. Please try again.');
              }
            } catch(unityErr) {
               console.error("UnityAds fallback error", unityErr);
               setProUnlockEndTime(Date.now() + 2 * 60 * 1000);
               setVisualEnhancer(filter.name);
            }
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
  };`;

// Use regex to replace the whole handleApplyFilter function
code = code.replace(/const handleApplyFilter = async \(filter: any\) => \{[\s\S]*?  \};/m, correctCode);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
console.log("DirectVideoPlayer fixed");
