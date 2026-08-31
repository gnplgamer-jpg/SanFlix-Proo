const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

content = content.replace(/if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*setSpinning\(true\);\s*await AdMob\.prepareRewardVideoAd[\s\S]*?triggerUnityAd\(\);\s*\/\/\s*Fallback\s*\}\s*\}/, `if (Capacitor.isNativePlatform()) {
      triggerUnityAd('spin');
    }`);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
console.log('patched');
