const fs = require('fs');
let code = fs.readFileSync('src/components/AdBanner.tsx', 'utf8');

const bannerInitCode = `
      // Native AdMob Banner
      const showNativeBanner = async () => {
        try {
          // Listen for errors to understand why it's not showing
          AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (info) => {
            console.error("AdMob Banner Failed:", info);
            // alert("Banner failed to load. If it's a new AdMob ID, it may take 24 hours to show ads.");
          });

          await AdMob.showBanner({
            adId: AD_CONFIG.admob.banner,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.TOP_CENTER, // Moved to top so it doesn't block BottomNav
            margin: 60, // Push below header
            isTesting: false
          });
        } catch (e) {
          console.error("AdMob Banner Error", e);
        }
      };
      showNativeBanner();
`;

code = code.replace(
  /\/\/ Native AdMob Banner[^]*showNativeBanner\(\);/m,
  bannerInitCode
);

fs.writeFileSync('src/components/AdBanner.tsx', code);
console.log('AdBanner.tsx updated');
