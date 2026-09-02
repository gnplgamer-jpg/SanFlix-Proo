const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const fetchOverride = `
import { Capacitor } from '@capacitor/core';

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (Capacitor.isNativePlatform()) {
    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof URL) {
      urlStr = input.toString();
    } else if (input && input.url) {
      urlStr = input.url;
    }

    if (urlStr.startsWith('/api/') || urlStr === '/version.json') {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ais-pre-npfy56f3b2r7xxg3atrdkd-822851301981.asia-east1.run.app';
      
      if (typeof input === 'string') {
        input = BASE_URL + input;
      } else if (input instanceof Request) {
        input = new Request(BASE_URL + urlStr, init || input);
      }
    }
  }
  return originalFetch(input, init);
};
`;

content = content.replace(/import \{ Capacitor \} from '@capacitor\/core';[\s\S]*?return originalFetch\(input, init\);\s*\};\s*/, fetchOverride);

fs.writeFileSync('src/main.tsx', content);
console.log('patched main.tsx 2');
