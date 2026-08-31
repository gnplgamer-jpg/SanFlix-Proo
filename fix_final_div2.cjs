const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

content = content.replace(
  /      <\/div>\n      <AnimatePresence>\n        \{showAd && \(/,
  `      </div>\n      </div>\n      <AnimatePresence>\n        {showAd && (`
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
