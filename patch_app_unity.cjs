const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { UnityAds }')) {
  content = content.replace(
    /import \{ AdMob \} from "@capacitor-community\/admob";/,
    'import { AdMob } from "@capacitor-community/admob";\nimport { UnityAds } from "capacitor-unity-ads";'
  );
  
  content = content.replace(
    /const initAdMob = async \(\) => \{[\s\S]*?initAdMob\(\);/m,
    `const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({
            testingDevices: [],
            initializeForTesting: false,
          });
        } catch(e) {
          console.error("AdMob Init Error", e);
        }
        try {
          await UnityAds.initialize({
            gameId: import.meta.env.VITE_UNITY_GAME_ID || "5687795", // Replace with correct ID if not matching
            testMode: false
          });
        } catch(e) {
          console.error("UnityAds Init Error", e);
        }
      }
    };
    initAdMob();`
  );
  fs.writeFileSync('src/App.tsx', content);
}
