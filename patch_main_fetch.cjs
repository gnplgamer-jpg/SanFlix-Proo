const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const oldFetchOverride = `window.fetch = async (input, init) => {
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
};`;

const newFetchOverride = `Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: async (input, init) => {
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
  }
});`;

// Because the exact whitespace might differ, let's use a regex replace instead.
content = content.replace(/window\.fetch = async \(input, init\) => \{[\s\S]*?return originalFetch\(input, init\);\s*\};/, newFetchOverride);

fs.writeFileSync('src/main.tsx', content);
console.log('fetch override fixed');
