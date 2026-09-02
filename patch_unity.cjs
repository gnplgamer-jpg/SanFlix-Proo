const fs = require('fs');

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/VITE_UNITY_GAME_ID \|\| ".*?"/, 'VITE_UNITY_GAME_ID || "5996901"');
fs.writeFileSync('src/App.tsx', appContent);

// Update SpinnerPage.tsx
let spinnerContent = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// We need to rewrite triggerUnityAd to show an alert on Native instead of fallback
const newTriggerUnityAd = `const triggerUnityAd = async (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {
    setAdPurpose(purpose);
    try {
      setSpinning(true);
      if (Capacitor.isNativePlatform()) {
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
          alert("Unity Ads: No ad available right now. Please try again later.");
        }
      } else {
        triggerWebAd(purpose);
      }
    } catch (e) {
      console.error("UnityAds fallback error", e);
      if (Capacitor.isNativePlatform()) {
        alert("Unity Ads: Failed to load ad. Please try again.");
      } else {
        triggerWebAd(purpose);
      }
    } finally {
      setSpinning(false);
    }
  };`;

spinnerContent = spinnerContent.replace(/const triggerUnityAd = async \([\s\S]*?finally \{\s*setSpinning\(false\);\s*\}\s*\};/, newTriggerUnityAd);

fs.writeFileSync('src/components/SpinnerPage.tsx', spinnerContent);
console.log('Unity patched');
