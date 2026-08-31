const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Add import for AlertTriangle if not present
if (!content.includes('AlertTriangle')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, AlertTriangle } from 'lucide-react';");
}

// Insert State
content = content.replace(
  /const \[showAd, setShowAd\] = useState\(false\);/,
  "const [showAd, setShowAd] = useState(false);\n  const [showAdBlockerMsg, setShowAdBlockerMsg] = useState(false);"
);

// Update handleSpinClick to include ad-blocker check
content = content.replace(
  /const handleSpinClick = async \(\) => \{\s*if \(spinning \|\| showAd \|\| cooldown > 0\) return;\s*playSound\(clickSound\);/m,
  `const handleSpinClick = async () => {
    if (spinning || showAd || cooldown > 0) return;
    playSound(clickSound);

    // Ad-blocker detection
    try {
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
    } catch (e) {
      setShowAdBlockerMsg(true);
      return;
    }`
);

// Add Overlay JSX before the last closing div
const overlayJSX = `
      <AnimatePresence>
        {showAdBlockerMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ad-Blocker Detected</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Please disable your ad-blocker to support SanFlix. We rely on ads to keep our streaming service free and provide you with daily coins.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowAdBlockerMsg(false)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                >
                  I've disabled it (Retry)
                </button>
                <button 
                  onClick={() => setShowAdBlockerMsg(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

content = content.replace(/<\/div>\s*\);\s*\}\s*$/m, overlayJSX);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
