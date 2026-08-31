const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const importTarget = `import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';`;
const importReplace = `import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';\nimport { InstallPWA } from './InstallPWA';`;
code = code.replace(importTarget, importReplace);

const pwaTarget = `          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            App Settings
          </h3>`;
const pwaReplace = `          <InstallPWA />
          <h3 className="text-white font-bold mb-4 mt-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            App Settings
          </h3>`;
code = code.replace(pwaTarget, pwaReplace);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
console.log("Updated ProfileHub for PWA");
