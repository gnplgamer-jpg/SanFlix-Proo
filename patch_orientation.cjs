const fs = require('fs');

let content = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');

// Add import if not exists
if (!content.includes("@capacitor/screen-orientation")) {
  content = content.replace(/import \{ Capacitor \} from '@capacitor\/core';/, "import { Capacitor } from '@capacitor/core';\nimport { ScreenOrientation } from '@capacitor/screen-orientation';");
}

// Replace orientation locks
// await screen.orientation.lock('landscape').catch(() => {});
content = content.replace(/await screen\.orientation\.lock\('landscape'\)\.catch\(\(\) => \{\}\);/g, `
          if (Capacitor.isNativePlatform()) {
            await ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
          } else {
            await screen.orientation.lock('landscape').catch(() => {});
          }
`);

// await screen.orientation.unlock().catch(() => {});
content = content.replace(/await screen\.orientation\.unlock\(\)\.catch\(\(\) => \{\}\);/g, `
          if (Capacitor.isNativePlatform()) {
            await ScreenOrientation.unlock().catch(() => {});
          } else {
            await screen.orientation.unlock().catch(() => {});
          }
`);

// await screen.orientation.lock(isPortrait ? 'portrait' : 'landscape').catch(() => {});
content = content.replace(/await screen\.orientation\.lock\(isPortrait \? 'portrait' : 'landscape'\)\.catch\(\(\) => \{\}\);/g, `
          if (Capacitor.isNativePlatform()) {
            await ScreenOrientation.lock({ orientation: isPortrait ? 'portrait' : 'landscape' as any }).catch(() => {});
          } else {
            await screen.orientation.lock(isPortrait ? 'portrait' : 'landscape').catch(() => {});
          }
`);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', content);
console.log('patched orientation');
