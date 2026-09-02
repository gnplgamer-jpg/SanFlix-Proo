const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// import AD_CONFIG
if (!code.includes("import { AD_CONFIG }")) {
  code = code.replace(
    'import { UnityAds } from "capacitor-unity-ads";',
    'import { UnityAds } from "capacitor-unity-ads";\nimport { AD_CONFIG } from "./config/ads";'
  );
}

// update UnityAds initialization
code = code.replace(
  /\/\/ await UnityAds\.initialize\(\{ gameId: 'YOUR_GAME_ID', testMode: true \}\);/,
  'await UnityAds.initialize({ gameId: AD_CONFIG.unity.gameId, testMode: false });'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');
