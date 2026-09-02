const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
const stateAnchor = "const [isAdPlaying, setIsAdPlaying] = useState(false);";
const newStates = `const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [fraudWarning, setFraudWarning] = useState<{message: string, count: number} | null>(null);`;
if (!code.includes('fraudWarning')) {
  code = code.replace(stateAnchor, newStates);
}

// Ensure Shield and AlertTriangle are imported from lucide-react if not already
if (!code.includes('AlertTriangle')) {
  code = code.replace('import { Play, Pause, X,', 'import { Play, Pause, X, AlertTriangle, Shield,');
}

// In SubscriptionModal, add onFraudWarning prop
const modalRegex = /<SubscriptionModal\s+trialMode=\{premiumTrialMode\}\s+onClose=\{[^}]+\}\s+onSubscribe=\{[^}]+\}\s+onWatchAdTrial=\{[^}]+\}\s+\/>/m;
const oldModal = `<SubscriptionModal 
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
          />`;

const newModal = `<SubscriptionModal 
            trialMode={premiumTrialMode}
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={(plan) => {
              const premiumUser = { ...user, isPremium: true };
              setUser(premiumUser);
              localStorage.setItem('sanflix_user', JSON.stringify(premiumUser));
              setShowPremiumModal(false);
              localStorage.setItem('SANFLIX_PREMIUM', 'true');
            }}
            onWatchAdTrial={() => {
               setShowPremiumModal(false);
               setIsAdPlaying(true);
            }}
            onFraudWarning={(msg) => {
               const warnings = parseInt(localStorage.getItem('SANFLIX_WARNINGS') || '0') + 1;
               localStorage.setItem('SANFLIX_WARNINGS', warnings.toString());
               
               if (warnings >= 3) {
                  // Permanent Ban
                  setFraudWarning({ message: "3rd WARNING: You have been permanently banned for attempting to cheat the Admin.", count: 3 });
                  auth.signOut();
                  auth.currentUser?.delete().catch(e => console.log("Failed to delete from Auth", e));
                  localStorage.removeItem('sanflix_user');
                  localStorage.setItem('SANFLIX_BANNED', 'true');
                  setUser(null);
                  setTimeout(() => {
                     window.location.reload();
                  }, 5000);
               } else {
                  setFraudWarning({ message: msg + \`\\n\\nWarning \${warnings}/3\`, count: warnings });
               }
            }}
          />`;
if (!code.includes('onFraudWarning')) {
  code = code.replace(oldModal, newModal);
}

// Add the Fraud Warning Modal UI
const fraudModalCode = `
      {/* Fraud Warning Modal */}
      <AnimatePresence>
        {fraudWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-md bg-gradient-to-b from-black to-red-950 border-2 border-red-600 rounded-3xl p-8 shadow-[0_0_80px_rgba(220,38,38,0.4)] text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
              
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                 <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                Admin Warning!
              </h2>
              
              <p className="text-red-200 text-lg mb-8 font-medium whitespace-pre-wrap">
                {fraudWarning.message}
              </p>
              
              {fraudWarning.count < 3 && (
                <button 
                  onClick={() => setFraudWarning(null)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-colors uppercase tracking-widest"
                >
                  I Understand
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

if (!code.includes('Admin Warning!')) {
  code = code.replace('<NoticeModal />', '<NoticeModal />\\n' + fraudModalCode);
}

// Banned Check on boot
const bootCheckRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/m;
const newBootCheck = `useEffect(() => {
    if (localStorage.getItem('SANFLIX_BANNED') === 'true') {
       alert("Your account is permanently banned for cheating.");
       return;
    }
    
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);`;
// code = code.replace(bootCheckRegex, newBootCheck);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx with Fraud Warning');
