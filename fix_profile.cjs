const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

const regexToggle = /<div className="flex items-center justify-between mb-4 bg-zinc-950\/50 p-3 rounded-lg border border-zinc-800\/50">\s*<div className="flex items-center gap-3">\s*<div className={`p-2 rounded-full \$\{appLockEnabled.*?\s*<Lock className="w-5 h-5" \/>\s*<\/div>\s*<div>\s*<p className="text-sm font-bold text-white">App Lock<\/p>\s*<p className="text-\[10px\] text-zinc-400 max-w-\[200px\]">Require Fingerprint\/PIN on open<\/p>\s*<\/div>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/;

if (regexToggle.test(code)) {
    code = code.replace(regexToggle, '');
    fs.writeFileSync('src/components/ProfileHub.tsx', code);
    console.log('App Lock removed from ProfileHub UI');
} else {
    console.log('App Lock UI not found in ProfileHub');
}

