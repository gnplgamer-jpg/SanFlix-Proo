const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

// Update Interface
if (!code.includes('onLogout: () => void;')) {
  code = code.replace('interface ProfileHubProps {', 'interface ProfileHubProps {\n  onLogout?: () => void;');
}
if (!code.includes('onLogout,')) {
  code = code.replace('setBatterySaver\n}: ProfileHubProps) {', 'setBatterySaver,\n  onLogout\n}: ProfileHubProps) {');
}

// Add UI for user and logout
const profilePlaceholder = `<div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0">`;

const userProfileHTML = `
      {/* User Profile Section */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          {user && !user.isGuest ? (
            <>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-20 h-20 rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] mb-4" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  <User className="w-8 h-8 text-red-500" />
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{user.displayName || 'Premium User'}</h2>
              <p className="text-sm text-zinc-400 mb-6">{user.email}</p>
              {onLogout && (
                 <button onClick={onLogout} className="px-6 py-2 bg-zinc-800 hover:bg-red-600 text-white rounded-full font-bold transition-colors text-sm shadow-lg flex items-center gap-2">
                   Logout
                 </button>
              )}
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-zinc-800/80 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <User className="w-8 h-8 text-zinc-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Guest User</h2>
              <p className="text-sm text-zinc-400 mb-6">Sign in to save your watchlist and sync devices</p>
              <button onClick={() => onChangeTab('home')} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                Sign In / Register
              </button>
            </>
          )}
        </div>
      </div>
`;

// Insert after the main container starts
code = code.replace('<div className="flex flex-col h-full bg-zinc-950 pb-20">', '<div className="flex flex-col h-full bg-zinc-950 pb-20">\n' + userProfileHTML);

// Needs 'User' icon from lucide-react
if (!code.includes('User,')) {
   code = code.replace('import { Lock', 'import { Lock, User');
}

fs.writeFileSync('src/components/ProfileHub.tsx', code);
console.log('Patched ProfileHub.tsx');
