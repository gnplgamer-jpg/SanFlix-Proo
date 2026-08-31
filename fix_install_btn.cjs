const fs = require('fs');
let code = fs.readFileSync('src/components/InstallPWA.tsx', 'utf-8');

const targetIf = `  if (!isInstallable) {
    return null; // Don't show button if not installable
  }`;

code = code.replace(targetIf, '');

const targetAlert = `alert("App is already installed or not supported in this browser.");`;
const replaceAlert = `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install on iOS: Tap the Share icon at the bottom, then tap 'Add to Home Screen'.");
      } else {
        alert("To install: Tap the 3-dot menu in your browser and select 'Install App' or 'Add to Home Screen'.");
      }`;

code = code.replace(targetAlert, replaceAlert);

fs.writeFileSync('src/components/InstallPWA.tsx', code);
console.log("Updated InstallPWA.tsx to always show button");
