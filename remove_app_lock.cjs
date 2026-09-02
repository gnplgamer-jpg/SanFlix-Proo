const fs = require('fs');

// 1. Remove from App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/import \{ BiometricLock \} from '\.\/components\/BiometricLock';\n/, '');
appCode = appCode.replace(/const \[appLockEnabled, setAppLockEnabled\].*;\n/, '');
appCode = appCode.replace(/const \[isAppLocked, setIsAppLocked\].*;\n/, '');
appCode = appCode.replace(/\{isAppLocked && <BiometricLock onUnlock=\{\(\) => setIsAppLocked\(false\)\} \/>\}\n/, '');
fs.writeFileSync('src/App.tsx', appCode);

// 2. Remove from ProfileHub.tsx
let profileCode = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');
profileCode = profileCode.replace(/const \[appLockEnabled, setAppLockEnabled\].*;\n/, '');

const regexToggle = /<div className="flex items-center justify-between p-4 bg-zinc-800\/30 rounded-2xl">[\s\S]*?<\/button>\s*<\/div>/g;
let match;
while ((match = regexToggle.exec(profileCode)) !== null) {
  if (match[0].includes('App Lock')) {
    profileCode = profileCode.replace(match[0], '');
  }
}

fs.writeFileSync('src/components/ProfileHub.tsx', profileCode);
console.log('App lock removed');
