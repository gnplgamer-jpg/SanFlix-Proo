const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const targetStr = `            <button
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
            </button>`;

const newStr = `            <button
              onClick={() => {
                if (adultPin) {
                  // Direct disable without window.confirm due to iframe sandbox restrictions
                  setAdultPin('');
                  localStorage.removeItem('SANFLIX_ADULT_PIN');
                } else {
                  setSetupPinInput('');
                  setPinError('');
                  setShowPinSetup(true);
                }
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded font-medium transition-colors border border-white/10"
            >
              {adultPin ? 'Disable' : 'Setup'}
            </button>`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/ProfileHub.tsx', code);
