const fs = require('fs');
let code = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

if (!code.includes("import { AdMob")) {
  code = code.replace(
    'import { UnityAds } from "capacitor-unity-ads";',
    'import { UnityAds } from "capacitor-unity-ads";\nimport { AdMob, RewardAdPluginEvents } from "@capacitor-community/admob";\nimport { AD_CONFIG } from "../config/ads";'
  );
}

const admobRewardedCode = `
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
`;

code = code.replace(
  /if \(Capacitor\.isNativePlatform\(\)\) \{[\s\S]*?\} else \{/,
  admobRewardedCode
);

fs.writeFileSync('src/components/SpinnerPage.tsx', code);
console.log("SpinnerPage updated to use AdMob");
