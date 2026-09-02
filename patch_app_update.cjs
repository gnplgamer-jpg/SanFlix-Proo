const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const updateLogic = `
  const CURRENT_APP_VERSION = '1.0.0';
  const [appUpdateData, setAppUpdateData] = useState<{ version: string; url: string; changelog: string; } | null>(null);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'SanFlix_Config', 'app_update'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        if (data.version && data.version !== CURRENT_APP_VERSION) {
          // Check if this version is technically "newer". For now, just inequality is fine, or simple check.
          if (data.version.trim() !== '') {
            setAppUpdateData(data);
          }
        }
      }
    });
    return () => unsub();
  }, []);
`;

// Insert after `const [isChatOpen, setIsChatOpen] = useState(false);`
code = code.replace(
  "const [isChatOpen, setIsChatOpen] = useState(false);",
  "const [isChatOpen, setIsChatOpen] = useState(false);\n" + updateLogic
);

// We need to render the App Update popup above everything.
const updatePopup = `
      {/* App Update Popup */}
      <AnimatePresence>
        {appUpdateData && (
          <div className="fixed inset-0 z-[10000] bg-black/90 flex flex-col items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Update Available!</h2>
              <p className="text-zinc-400 font-medium mb-2">Version {appUpdateData.version} is here</p>
              
              <div className="bg-zinc-950 rounded-xl p-4 mb-6 text-left border border-zinc-800 h-32 overflow-y-auto">
                <h4 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wider">What's New:</h4>
                <p className="text-zinc-300 text-sm whitespace-pre-line">{appUpdateData.changelog}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = appUpdateData.url}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  Update Now
                </button>
                <button 
                  onClick={() => setAppUpdateData(null)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

// Insert it right after the global `AnimatePresence` or just at the end of the root `div`
code = code.replace(
  "{/* Global Video Player Overlay (Persists for PiP) */}",
  updatePopup + "\n      {/* Global Video Player Overlay (Persists for PiP) */}"
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app.tsx for update popup');
