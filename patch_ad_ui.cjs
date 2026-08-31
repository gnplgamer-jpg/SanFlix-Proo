const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

content = content.replace(
/Advertisement<\/span>[\s\S]*?<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900 to-black">[\s\S]*?<\/div>/m,
`Sponsor link opened!</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 text-sm font-medium">
                  {adTimer > 0 ? \`Verifying in \${adTimer}s\` : 'Reward granted'}
                </span>
                <button 
                  disabled={adTimer > 0} 
                  onClick={() => { setShowAd(false); finishSpin(); }}
                  className={\`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white transition-opacity \${adTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-zinc-700'}\`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Ad Content area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900 to-black">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-transparent animate-pulse" />
                <Gift className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Please wait</h2>
              <p className="text-zinc-400 mb-8 max-w-xs">
                {adTimer > 0 
                  ? "We have opened a sponsor link in your browser. Return to the app after viewing it to claim your reward." 
                  : "Thanks for viewing! You can close this screen now to claim your coins."}
              </p>
              
              {adTimer > 0 && (
                <div className="w-full max-w-[200px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: \`\${((10 - adTimer) / 10) * 100}%\` }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              )}
            </div>`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
