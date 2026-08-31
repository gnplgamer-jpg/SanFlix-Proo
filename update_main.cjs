const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf-8');

const importTarget = `import { createRoot } from 'react-dom/client';`;
const importReplace = `import { createRoot } from 'react-dom/client';\nimport { registerSW } from 'virtual:pwa-register';`;
code = code.replace(importTarget, importReplace);

const registerCode = `
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}
`;
code = code + registerCode;

fs.writeFileSync('src/main.tsx', code);
console.log("Updated main.tsx for PWA");
