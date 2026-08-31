const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Replace the AdMob-first logic with Unity-first logic in handleClaimCheckIn
content = content.replace(/await AdMob\.prepareRewardVideoAd\([\s\S]*?triggerUnityAd\('checkin'\);\s*\}\s*\} catch \(error\) \{[\s\S]*?triggerUnityAd\('checkin'\);\s*\}/, `await triggerUnityAd('checkin');`);

// Replace the AdMob-first logic with Unity-first logic in handleTrailerMission
content = content.replace(/await AdMob\.prepareRewardVideoAd\([\s\S]*?triggerUnityAd\('mission'\);\s*\}\s*\} catch \(error\) \{[\s\S]*?triggerUnityAd\('mission'\);\s*\}/, `await triggerUnityAd('mission');`);

// Replace the spin logic
content = content.replace(/await AdMob\.prepareRewardVideoAd\([\s\S]*?triggerUnityAd\('spin'\);\s*\}\s*\} catch \(error\) \{[\s\S]*?triggerUnityAd\('spin'\);\s*\}/, `await triggerUnityAd('spin');`);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
console.log('Priority patched');
