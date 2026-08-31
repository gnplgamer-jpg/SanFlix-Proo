const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf-8');

const target = `registerType: 'autoUpdate',
        includeAssets: ['icon.png'],`;
const replace = `registerType: 'autoUpdate',
        includeAssets: ['icon.png'],
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000 // 5MB limit
        },`;

code = code.replace(target, replace);
fs.writeFileSync('vite.config.ts', code);
console.log("Updated vite config with workbox size limit");
