const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

// Add toggleTarget state
code = code.replace(
  "const [showAgeGate, setShowAgeGate] = useState(false);",
  "const [showAgeGate, setShowAgeGate] = useState(false);\n  const [toggleTarget, setToggleTarget] = useState<'adult' | 'phub'>('adult');"
);

// Update handleToggleAttempt
code = code.replace(
  /const handleToggleAttempt = \(\) => {[\s\S]*?};/,
  `const handleToggleAttempt = (target: 'adult' | 'phub') => {
    setToggleTarget(target);
    if (adultPin) {
      setPinInput('');
      setPinError('');
      setShowPinGate(true);
    } else {
      setShowAgeGate(true);
    }
  };`
);

// Update onClick of adult toggle
code = code.replace(
  "onClick={handleToggleAttempt}",
  "onClick={() => handleToggleAttempt('adult')}"
);

// Update confirmToggle
code = code.replace(
  /const confirmToggle = \(\) => {[\s\S]*?};/,
  `const confirmToggle = () => {
    if (toggleTarget === 'adult') {
      setIsAdultEnabled(!isAdultEnabled);
    } else {
      const currentVal = localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true';
      localStorage.setItem('SANFLIX_PHUB_ENABLED', String(!currentVal));
      window.location.reload();
    }
    setShowAgeGate(false);
  };`
);

// Update onClick of phub toggle
code = code.replace(
  `onClick={() => {
                  const currentVal = localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true';
                  localStorage.setItem('SANFLIX_PHUB_ENABLED', String(!currentVal));
                  // force reload to apply global state
                  window.location.reload();
                }}`,
  `onClick={() => handleToggleAttempt('phub')}`
);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
