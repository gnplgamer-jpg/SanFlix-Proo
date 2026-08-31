const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

content = content.replace(
/const handleSpinClick = async \(\) => \{[\s\S]*?const finishSpin = \(\) => \{/m,
`const triggerWebAd = () => {
    if (DIRECT_AD_LINK && DIRECT_AD_LINK.includes("http")) {
      window.open(DIRECT_AD_LINK, '_blank');
    }
    setShowAd(true);
    setAdTimer(10); // Show "Verifying Sponsor" screen for 10 seconds
  };

  const handleSpinClick = async () => {
    if (spinning || showAd || cooldown > 0) return;
    playSound(clickSound);
    
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
          // If AdMob fails (e.g. not on Play Store), fallback to Web Ad
          triggerWebAd();
        });
        await AdMob.showRewardVideoAd();
      } catch (error) {
        console.error("AdMob Error", error);
        triggerWebAd(); // Fallback
      }
    } else if (typeof (window as any).AndroidApp !== "undefined" && typeof (window as any).AndroidApp.showRewardedAd === "function") {
       (window as any).AndroidApp.showRewardedAd();
    } else if (typeof (window as any).SanFlixNativeBridge !== "undefined" && typeof (window as any).SanFlixNativeBridge.triggerAdUnlock === "function") {
       (window as any).SanFlixNativeBridge.triggerAdUnlock();
    } else {
      triggerWebAd();
    }
  };

  const finishSpin = () => {`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
