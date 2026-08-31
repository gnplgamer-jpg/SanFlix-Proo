const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const target1 = `export function ProfileHub({ onClose, onAdminUnlocked, onLogout }: ProfileHubProps) {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');`;

const replacement1 = `export function ProfileHub({ onClose, onAdminUnlocked, onLogout }: ProfileHubProps) {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

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

code = code.replace(target1, replacement1);

const target2 = `            <a href="https://www.facebook.com/profile.php?id=61591278745249" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

const replacement2 = `            <a href="https://www.facebook.com/profile.php?id=61591278745249" onClick={(e) => openInChrome(e, 'https://www.facebook.com/profile.php?id=61591278745249')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

code = code.replace(target2, replacement2);

const target3 = `            <a href="https://tiktok.com/@sanflix.pro.offici" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

const replacement3 = `            <a href="https://tiktok.com/@sanflix.pro.offici" onClick={(e) => openInChrome(e, 'https://tiktok.com/@sanflix.pro.offici')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

code = code.replace(target3, replacement3);

const target4 = `            <a href="https://youtube.com/@sanflixpro_official" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

const replacement4 = `            <a href="https://youtube.com/@sanflixpro_official" onClick={(e) => openInChrome(e, 'https://youtube.com/@sanflixpro_official')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">`;

code = code.replace(target4, replacement4);

const target5 = `          <a 
            href="https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white rounded-lg p-3 font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] text-sm"
          >`;

const replacement5 = `          <a 
            href="https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1"
            onClick={(e) => openInChrome(e, 'https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1')}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white rounded-lg p-3 font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] text-sm"
          >`;

code = code.replace(target5, replacement5);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
