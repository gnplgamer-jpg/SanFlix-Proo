const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const targetStr = `        <div className="bg-zinc-900/80 border border-[#E50914]/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-[#E50914]">Adult Content (18+)</span>
              <span className="text-xs text-zinc-400 mt-1">Enable encrypted hot networks</span>
            </div>
            <button
              onClick={handleToggleAttempt}
              className={\`w-14 h-7 rounded-full transition-colors relative flex items-center \${isAdultEnabled ? 'bg-[#E50914]' : 'bg-zinc-700'}\`}
            >
              <div
                className={\`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md \${isAdultEnabled ? 'left-8' : 'left-1'}\`}
              />
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> PIN Lock</span>
              <span className="text-xs text-zinc-400 mt-0.5">
                {adultPin ? "PIN is enabled" : "Set 4-digit PIN"}
              </span>
            </div>
            <button
              onClick={() => {
                if (adultPin) {
                  if (window.confirm("Do you want to remove the PIN lock?")) {
                    setAdultPin('');
                    localStorage.removeItem('SANFLIX_ADULT_PIN');
                  }
                } else {
                  setSetupPinInput('');
                  setPinError('');
                  setShowPinSetup(true);
                }
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded font-medium transition-colors border border-white/10"
            >
              {adultPin ? 'Disable' : 'Setup'}
            </button>
          </div>
        </div>`;

const newStr = `        <div className="bg-zinc-900/80 border border-[#E50914]/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-[#E50914]">Adult Content (18+)</span>
              <span className="text-xs text-zinc-400 mt-1">Enable encrypted hot networks</span>
            </div>
            <button
              onClick={handleToggleAttempt}
              className={\`w-14 h-7 rounded-full transition-colors relative flex items-center \${isAdultEnabled ? 'bg-[#E50914]' : 'bg-zinc-700'}\`}
            >
              <div
                className={\`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md \${isAdultEnabled ? 'left-8' : 'left-1'}\`}
              />
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> PIN Lock</span>
              <span className="text-xs text-zinc-400 mt-0.5">
                {adultPin ? "PIN is enabled" : "Set 4-digit PIN"}
              </span>
            </div>
            <button
              onClick={() => {
                if (adultPin) {
                  if (window.confirm("Do you want to remove the PIN lock?")) {
                    setAdultPin('');
                    localStorage.removeItem('SANFLIX_ADULT_PIN');
                  }
                } else {
                  setSetupPinInput('');
                  setPinError('');
                  setShowPinSetup(true);
                }
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded font-medium transition-colors border border-white/10"
            >
              {adultPin ? 'Disable' : 'Setup'}
            </button>
          </div>
        </div>

        {isAdultEnabled && (
          <div className="bg-gradient-to-r from-orange-600/20 to-zinc-900/80 border border-orange-500/50 rounded-xl p-4 shadow-[0_4px_20px_rgba(249,115,22,0.15)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-white bg-black px-2 py-0.5 rounded font-mono border border-zinc-800">Porn <span className="text-orange-500">Hub</span></span>
                </div>
                <span className="text-xs text-zinc-400 mt-1">Exclusive content hub (Separate Home)</span>
              </div>
              <button
                onClick={() => {
                  const currentVal = localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true';
                  localStorage.setItem('SANFLIX_PHUB_ENABLED', String(!currentVal));
                  // force reload to apply global state
                  window.location.reload();
                }}
                className={\`w-14 h-7 rounded-full transition-colors relative flex items-center \${localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true' ? 'bg-orange-500' : 'bg-zinc-700'}\`}
              >
                <div
                  className={\`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md \${localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true' ? 'left-8' : 'left-1'}\`}
                />
              </button>
            </div>
          </div>
        )}`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/ProfileHub.tsx', code);
