const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

code = code.replace(
  "const [toggleTarget, setToggleTarget] = useState<'adult' | 'phub'>('adult');",
  "const [toggleTarget, setToggleTarget] = useState<'adult' | 'phub' | 'disable_pin'>('adult');"
);

const confirmPinTarget = `  const confirmPinGate = () => {
    if (pinInput === adultPin) {
      setShowPinGate(false);
      setShowAgeGate(true);
    } else {
      setPinError('Incorrect PIN');
    }
  };`;

const confirmPinReplace = `  const confirmPinGate = () => {
    if (pinInput === adultPin) {
      setShowPinGate(false);
      if (toggleTarget === 'disable_pin') {
        setAdultPin('');
        localStorage.removeItem('SANFLIX_ADULT_PIN');
      } else {
        setShowAgeGate(true);
      }
    } else {
      setPinError('Incorrect PIN');
    }
  };`;
code = code.replace(confirmPinTarget, confirmPinReplace);

const disableTarget = `            <button
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
            >`;

const disableReplace = `            <button
              onClick={() => {
                if (adultPin) {
                  setToggleTarget('disable_pin');
                  setPinInput('');
                  setPinError('');
                  setShowPinGate(true);
                } else {
                  setSetupPinInput('');
                  setPinError('');
                  setShowPinSetup(true);
                }
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded font-medium transition-colors border border-white/10"
            >`;
code = code.replace(disableTarget, disableReplace);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
