const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// The missing div is before the FIRST <AnimatePresence> in the return block.
content = content.replace(
  /      <AnimatePresence>\s*\{showAd && \(/,
  `      </div>\n      <AnimatePresence>\n        {showAd && (`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
