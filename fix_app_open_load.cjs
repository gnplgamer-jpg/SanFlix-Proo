const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /await AdMob\.prepareAppOpen\(\{ adId: AD_CONFIG\.admob\.appOpen, isTesting: false \}\);/g,
  'await AdMob.loadAppOpen({ adId: AD_CONFIG.admob.appOpen, isTesting: false });'
);

fs.writeFileSync('src/App.tsx', code);
