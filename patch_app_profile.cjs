const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldProfile = `<ProfileHub
            isAdultEnabled={isAdultEnabled}
            setIsAdultEnabled={setIsAdultEnabled}
            isAdminUnlocked={isAdminUnlocked}
            setIsAdminUnlocked={setIsAdminUnlocked}
            onChangeTab={setActiveTab}
            appLockEnabled={appLockEnabled}
            setAppLockEnabled={setAppLockEnabled}
            batterySaver={batterySaver}
            setBatterySaver={setBatterySaver}
          />`;

const newProfile = `<ProfileHub
            user={user}
            onLogout={() => {
              auth.signOut();
              localStorage.removeItem('sanflix_user');
              localStorage.removeItem('sanflix_guest_id');
            }}
            isAdultEnabled={isAdultEnabled}
            setIsAdultEnabled={setIsAdultEnabled}
            isAdminUnlocked={isAdminUnlocked}
            setIsAdminUnlocked={setIsAdminUnlocked}
            onChangeTab={setActiveTab}
            appLockEnabled={appLockEnabled}
            setAppLockEnabled={setAppLockEnabled}
            batterySaver={batterySaver}
            setBatterySaver={setBatterySaver}
          />`;

code = code.replace(oldProfile, newProfile);
fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx with user prop for ProfileHub');
