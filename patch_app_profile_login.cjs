const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const oldProfile = `<ProfileHub
            user={user}
            onLogout={() => {
              auth.signOut();
              localStorage.removeItem('sanflix_user');
              localStorage.removeItem('sanflix_guest_id');
            }}`;

const newProfile = `<ProfileHub
            user={user}
            onLogout={() => {
              auth.signOut();
              localStorage.removeItem('sanflix_user');
              localStorage.removeItem('sanflix_guest_id');
              setUser(null);
            }}
            onLoginClick={() => setShowAuthModal(true)}`;

if (!appCode.includes('onLoginClick={() => setShowAuthModal(true)}')) {
  appCode = appCode.replace(oldProfile, newProfile);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log('Patched App.tsx to pass onLoginClick');
} else {
  console.log('Already patched App.tsx');
}
