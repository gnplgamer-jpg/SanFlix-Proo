const fs = require('fs');
let code = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

const correctSpinnerCode = `  const triggerUnityAd = async (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {
    setAdPurpose(purpose);
    try {
      setSpinning(true);
      if (Capacitor.isNativePlatform()) {
        try {
          // Try AdMob Rewarded first
          AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
            console.log("AdMob Rewarded: ", rewardItem);
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
          });

          await AdMob.prepareRewardVideoAd({ adId: AD_CONFIG.admob.rewarded, isTesting: false });
          await AdMob.showRewardVideoAd();
        } catch (admobErr) {
          console.error("AdMob Rewarded Error", admobErr);
          try {
            // Fallback to UnityAds
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
              console.warn("Unity Ads no ad available, falling back to simulated ad."); triggerWebAd(purpose);
            }
          } catch (unityErr) {
             console.error("UnityAds fallback error", unityErr);
             console.warn("Native load failed, falling back to simulated ad for testing."); triggerWebAd(purpose);
          }
        }
      } else {
        triggerWebAd(purpose);
      }
    } catch (e) {
      console.error("UnityAds fallback error", e);
      if (Capacitor.isNativePlatform()) {
        console.warn("Unity Ads native load failed, falling back to simulated ad for testing."); triggerWebAd(purpose);
      } else {
        triggerWebAd(purpose);
      }
    } finally {
      setSpinning(false);
    }
  };`;

// Use regex to replace the whole triggerUnityAd function
code = code.replace(/const triggerUnityAd = async \(purpose: 'spin' \| 'mission' \| 'checkin' = 'spin'\) => \{[\s\S]*?    \} finally \{[\s\S]*?    \}\n  \};/m, correctSpinnerCode);

fs.writeFileSync('src/components/SpinnerPage.tsx', code);
console.log("SpinnerPage fixed");
