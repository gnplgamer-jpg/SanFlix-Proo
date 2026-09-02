const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove AdMob import
content = content.replace('import { AdMob } from "@capacitor-community/admob";\n', '');

// Remove initAdMob
content = content.replace(/const initAdMob = async \(\) => \{[\s\S]*?initAdMob\(\);/, `const initUnityAds = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Initialize Unity Ads
          // Game ID should be your actual Unity Game ID
          // await UnityAds.initialize({ gameId: 'YOUR_GAME_ID', testMode: true });
        }
      } catch (e) {
        console.error("UnityAds Init Error", e);
      }
    };
    initUnityAds();`);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched');
