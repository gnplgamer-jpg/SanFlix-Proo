const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

if (!content.includes('import { UnityAds }')) {
  content = content.replace(
    /import \{ AdMob, RewardAdPluginEvents \} from "@capacitor-community\/admob";/,
    'import { AdMob, RewardAdPluginEvents } from "@capacitor-community/admob";\nimport { UnityAds } from "capacitor-unity-ads";'
  );
}

content = content.replace(
/const DIRECT_AD_LINK = "https:\\\/\\\/www\.google\.com";[\s\S]*?\/\/ TODO: Replace with Adsterra Direct Link/,
`const DIRECT_AD_LINK = "https://omg10.com/4/10394106"; // Monetag link`
);

content = content.replace(
/const triggerWebAd = \(\) => \{[\s\S]*?const handleSpinClick = async \(\) => \{/m,
`const triggerWebAd = () => {
    if (DIRECT_AD_LINK && DIRECT_AD_LINK.includes("http")) {
      window.open(DIRECT_AD_LINK, '_blank');
    }
    setShowAd(true);
    setAdTimer(10); // Show "Verifying Sponsor" screen for 10 seconds
  };

  const triggerUnityAd = async () => {
    try {
      setSpinning(true);
      await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
      const result = await UnityAds.showRewardedVideo();
      if (result && result.success) {
        finishSpin();
      } else {
        triggerWebAd(); // Ultimate fallback
      }
    } catch (e) {
      console.error("UnityAds fallback error", e);
      triggerWebAd(); // Ultimate fallback
    } finally {
      setSpinning(false);
    }
  };

  const handleSpinClick = async () => {`
);

content = content.replace(
/AdMob\.addListener\(RewardAdPluginEvents\.FailedToLoad, \(\) => \{[\s\S]*?\}\);/m,
`AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          // If AdMob fails (e.g. not on Play Store), fallback to Unity Ads
          triggerUnityAd();
        });`
);

content = content.replace(
/catch \(error\) \{\s*console\.error\("AdMob Error", error\);\s*triggerWebAd\(\); \/\/ Fallback\s*\}/m,
`catch (error) {
        console.error("AdMob Error", error);
        triggerUnityAd(); // Fallback
      }`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
