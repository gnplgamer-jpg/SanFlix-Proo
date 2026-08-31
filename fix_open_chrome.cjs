const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const target = `export function ProfileHub({ onClose, onAdminUnlocked, onLogout }: ProfileHubProps) {`;

const replacement = `export function ProfileHub({ onClose, onAdminUnlocked, onLogout }: ProfileHubProps) {
  const openInChrome = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, url: string) => {
    e.preventDefault();
    const isAndroid = /android/i.test(navigator.userAgent || '');
    if (isAndroid) {
      const intentUrl = url.replace(/^https?:\\/\\//, 'intent://') + '#Intent;scheme=https;package=com.android.chrome;end';
      window.location.href = intentUrl;
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1000);
    } else {
      window.open(url, '_blank');
    }
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/ProfileHub.tsx', code);
