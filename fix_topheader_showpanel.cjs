const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

code = code.replace(
  "const [showDailyClaim, setShowDailyClaim] = useState(false);",
  "const [showDailyClaim, setShowDailyClaim] = useState(false);\n  const [showPanel, setShowPanel] = useState(false);"
);

fs.writeFileSync('src/components/TopHeader.tsx', code);
