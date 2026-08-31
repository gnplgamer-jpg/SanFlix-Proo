const fs = require('fs');
let content = fs.readFileSync('src/components/LudoGame.tsx', 'utf8');

const adCode = `
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => setAdTimer(t => t - 1), 1000);
    } else if (showAd && adTimer === 0) {
      // Auto close or allow close
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);
`;

// Insert after useState
content = content.replace(/const \[winner, setWinner\] = useState<PlayerColor \| null>\(null\);/, `const [winner, setWinner] = useState<PlayerColor | null>(null);\n${adCode}`);

// Modify win logic
content = content.replace(/setTimeout\(onGameEnd, 3000\); \/\/ trigger ad after 3s/, `setTimeout(() => setShowAd(true), 3000);`);

const adUI = `
      <AnimatePresence>
        {showAd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="w-full h-14 flex justify-between items-center px-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <span className="text-zinc-400 text-xs font-bold px-2 py-1 bg-zinc-800 rounded">Advertisement</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 text-sm font-medium">
                  {adTimer > 0 ? \`Reward in \${adTimer}s\` : 'Reward granted'}
                </span>
                <button 
                  disabled={adTimer > 0} 
                  onClick={() => { setShowAd(false); onGameEnd(); }}
                  className={\`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white transition-opacity \${adTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-zinc-700'}\`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
              <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="z-10 flex flex-col items-center text-center max-w-sm">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-1 mb-6 shadow-2xl shadow-indigo-600/40 flex items-center justify-center">
                   <div className="w-full h-full bg-black rounded-[26px] flex items-center justify-center">
                      <Gamepad2 className="w-12 h-12 text-indigo-500" />
                   </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Play More Games</h2>
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Discover thousands of premium games in our new Game Hub!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;

content = content.replace(/<\/div>\n  \);\n\}/, `${adUI}\n    </div>\n  );\n}`);

// Import X and Gamepad2
content = content.replace(/import \{ ChevronLeft, Users, Bot, Settings, Trophy, Play, Home \} from 'lucide-react';/, `import { ChevronLeft, Users, Bot, Settings, Trophy, Play, Home, X, Gamepad2 } from 'lucide-react';`);

fs.writeFileSync('src/components/LudoGame.tsx', content);
