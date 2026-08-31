const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Update adPurpose type
content = content.replace(
  /const \[adPurpose, setAdPurpose\] = useState\<'spin' \| 'mission'\>\('spin'\);/,
  `const [adPurpose, setAdPurpose] = useState<'spin' | 'mission' | 'checkin'>('spin');`
);

// Update triggerWebAd type
content = content.replace(
  /const triggerWebAd = \(purpose: 'spin' \| 'mission' = 'spin'\) => \{/,
  `const triggerWebAd = (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {`
);

// Update triggerUnityAd type
content = content.replace(
  /const triggerUnityAd = async \(purpose: 'spin' \| 'mission' = 'spin'\) => \{/,
  `const triggerUnityAd = async (purpose: 'spin' | 'mission' | 'checkin' = 'spin') => {`
);

// Update triggerUnityAd reward logic
content = content.replace(
  /if \(purpose === 'spin'\) finishSpin\(\);\n\s*else \{\n\s*onReward\(20\);\n\s*setTrailerClaimed\(true\);\n\s*localStorage.setItem\('daily_trailer_' \+ new Date\(\)\.toDateString\(\), 'true'\);\n\s*\}/,
  `if (purpose === 'spin') { finishSpin(); }
        else if (purpose === 'checkin') {
          onReward(15);
          setDailyCheckInClaimed(true);
          localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true');
        } else {
          onReward(20);
          setTrailerClaimed(true);
          localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
        }`
);

// Update close ad handler logic
content = content.replace(
  /onClick=\{\(\) => \{ setShowAd\(false\); if \(adPurpose === 'spin'\) finishSpin\(\); \}\}/,
  `onClick={() => { setShowAd(false); if (adPurpose === 'spin') { finishSpin(); } else if (adPurpose === 'checkin') { onReward(15); setDailyCheckInClaimed(true); localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true'); } else { onReward(20); setTrailerClaimed(true); localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true'); } }}`
);

// Update handleClaimCheckIn
content = content.replace(
  /const handleClaimCheckIn = \(\) => \{\s*if \(dailyCheckInClaimed\) return;\s*playSound\(clickSound\);\s*onReward\(50\);\s*setDailyCheckInClaimed\(true\);\s*localStorage\.setItem\('daily_checkin_' \+ new Date\(\)\.toDateString\(\), 'true'\);\s*\};/,
  `const handleClaimCheckIn = async () => {
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
  };`
);

// Update +50 Coins to +15 Coins in UI
content = content.replace(
  /<p className="text-yellow-500 text-sm font-medium">\+50 Coins<\/p>/,
  `<p className="text-yellow-500 text-sm font-medium">+15 Coins (Ad)</p>`
);

// Update UI to say Watch Trailer (Ad) as well
content = content.replace(
  /<p className="text-yellow-500 text-sm font-medium">\+20 Coins<\/p>/,
  `<p className="text-yellow-500 text-sm font-medium">+20 Coins (Ad)</p>`
);

// Update Daily Check-in Title
content = content.replace(
  /<h4 className="text-white font-bold">Daily Check-in<\/h4>/,
  `<h4 className="text-white font-bold">VIP Check-in</h4>`
);


fs.writeFileSync('src/components/SpinnerPage.tsx', content);
