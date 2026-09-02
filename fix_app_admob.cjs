const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { AdMob }")) {
  code = code.replace(
    'import { UnityAds } from "capacitor-unity-ads";',
    'import { UnityAds } from "capacitor-unity-ads";\nimport { AdMob } from "@capacitor-community/admob";'
  );
}

const admobInitCode = `
          // Initialize AdMob
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: [],
            initializeForTesting: false,
          });
`;

if (!code.includes("AdMob.initialize")) {
  code = code.replace(
    'if (Capacitor.isNativePlatform()) {',
    'if (Capacitor.isNativePlatform()) {' + admobInitCode
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated for AdMob init');
