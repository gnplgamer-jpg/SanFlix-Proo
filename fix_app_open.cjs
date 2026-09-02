const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const appOpenInitCode = `
          // Initialize AdMob and AppOpen
          await AdMob.initialize({});
          try {
            await AdMob.prepareAppOpen({ adId: AD_CONFIG.admob.appOpen, isTesting: false });
            await AdMob.showAppOpen();
          } catch(e) { console.error("AppOpen Error", e); }
`;

code = code.replace(
  /await AdMob\.initialize\(\{[^]*?\}\);/m,
  appOpenInitCode
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated for AppOpen');
