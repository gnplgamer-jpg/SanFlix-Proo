const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Insert handleClaimCheckIn and handleTrailerMission before handleSpinClick
if (!content.includes('const handleClaimCheckIn')) {
    content = content.replace(
      /const handleSpinClick = async \(\) => \{/,
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

  const handleSpinClick = async () => {`
    );
}

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
