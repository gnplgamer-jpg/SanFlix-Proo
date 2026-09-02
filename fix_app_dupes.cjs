const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix states
code = code.replace(/const \[showPremiumModal, setShowPremiumModal\] = useState\(false\);\s*const \[premiumTrialMode, setPremiumTrialMode\] = useState\(false\);\s*const \[isAdPlaying, setIsAdPlaying\] = useState\(false\);\s*/, '');
// One is removed, one stays

// Fix back navigation
code = code.replace(/if \(state\.isAdPlaying\) return;\s*if \(state\.showPremiumModal\) \{\s*setShowPremiumModal\(false\);\s*return;\s*\}/, '');

// Fix stateRefs
code = code.replace(/showPremiumModal, isAdPlaying, showPremiumModal, isAdPlaying,/, 'showPremiumModal, isAdPlaying,');

// Fix duplicate Modals block
const modalBlockDupe = `{showPremiumModal && (
          <SubscriptionModal 
            trialMode={premiumTrialMode}
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={(plan) => {
              // Mock success
              const premiumUser = { ...user, isPremium: true };
              setUser(premiumUser);
              localStorage.setItem('sanflix_user', JSON.stringify(premiumUser));
              setShowPremiumModal(false);
              // Store locally as well
              localStorage.setItem('SANFLIX_PREMIUM', 'true');
            }}
            onWatchAdTrial={() => {
               setShowPremiumModal(false);
               setIsAdPlaying(true);
            }}
          />
        )}
        {isAdPlaying && (
          <AdPlayer 
            onAdComplete={() => {
               setIsAdPlaying(false);
               const newExpiry = Date.now() + (10 * 60 * 1000); // 10 minutes
               localStorage.setItem('SANFLIX_LIVE_TRIAL_EXPIRY', newExpiry.toString());
            }}
          />
        )}`;

code = code.replace(modalBlockDupe, ''); 

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed double patches in App.tsx');
