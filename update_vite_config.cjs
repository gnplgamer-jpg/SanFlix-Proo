const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf-8');

const importTarget = `import {defineConfig} from 'vite';`;
const importReplace = `import {defineConfig} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';`;
code = code.replace(importTarget, importReplace);

const pluginsTarget = `plugins: [react(), tailwindcss()],`;
const pluginsReplace = `plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.png'],
        manifest: {
          name: 'SanFlix Pro',
          short_name: 'SanFlix',
          description: 'Premium Movie Streaming',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          icons: [
            {
              src: 'icon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],`;
code = code.replace(pluginsTarget, pluginsReplace);

fs.writeFileSync('vite.config.ts', code);
console.log("Updated vite.config.ts for PWA");
