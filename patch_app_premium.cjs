const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
if (!code.includes('import { SubscriptionModal }')) {
  code = code.replace("import { AuthModal } from './components/AuthModal';", "import { AuthModal } from './components/AuthModal';\nimport { SubscriptionModal } from './components/SubscriptionModal';\nimport { AdPlayer } from './components/AdPlayer';");
}

// States
const stateAnchor = "const [showAuthModal, setShowAuthModal] = useState(false);";
const newStates = `const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumTrialMode, setPremiumTrialMode] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);`;
code = code.replace(stateAnchor, newStates);

// Back button layer
code = code.replace("if (state.showAuthModal) {", "if (state.isAdPlaying) return;\n      if (state.showPremiumModal) {\n        setShowPremiumModal(false);\n        return;\n      }\n      if (state.showAuthModal) {");

code = code.replace("globalVideo, showAuthModal,", "globalVideo, showAuthModal, showPremiumModal, isAdPlaying,");

// Pass premium actions to LiveTvScreen
code = code.replace("<LiveTvScreen />", `<LiveTvScreen 
            user={user}
            onRequirePremium={(expired) => {
               setPremiumTrialMode(expired);
               setShowPremiumModal(true);
            }} 
          />`);

// Insert the Modals at the end before </AnimatePresence>
const modalsBlock = `{showPremiumModal && (
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

code = code.replace("{showAuthModal && (", modalsBlock + "\n        {showAuthModal && (");

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx for Premium');
