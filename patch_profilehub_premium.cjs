const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

const oldUserBadge = `<h2 className="text-xl font-bold text-white mb-1">{user.displayName || 'Premium User'}</h2>`;
const newUserBadge = `<h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                 {user.displayName || 'User'}
                 {(user.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true') && (
                   <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                     <Crown className="w-3 h-3" /> Pro
                   </span>
                 )}
              </h2>`;

if (!code.includes('<Crown className=')) {
  code = code.replace(oldUserBadge, newUserBadge);
  if (!code.includes('Crown')) {
    code = code.replace('import { Lock, User', 'import { Lock, User, Crown');
  }
}

fs.writeFileSync('src/components/ProfileHub.tsx', code);
console.log('Patched ProfileHub.tsx with Premium Badge');
