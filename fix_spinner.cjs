const fs = require('fs');
let code = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Replace the alert with fallback
code = code.replace(
  'alert("Unity Ads: Failed to load ad. Please try again.");',
  'console.warn("Unity Ads native load failed, falling back to simulated ad for testing."); triggerWebAd(purpose);'
);

code = code.replace(
  'alert("Unity Ads: No ad available right now. Please try again later.");',
  'console.warn("Unity Ads no ad available, falling back to simulated ad."); triggerWebAd(purpose);'
);

fs.writeFileSync('src/components/SpinnerPage.tsx', code);
console.log('SpinnerPage patched to not block on native ad failure');
