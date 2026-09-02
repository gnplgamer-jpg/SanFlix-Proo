import { registerSW } from 'virtual:pwa-register';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';


import { Capacitor } from '@capacitor/core';

const originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
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
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}
