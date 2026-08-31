const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

content = content.replace(
  /      <\/div>\n      <\/div>\n      <\/div>\n      <AnimatePresence>/,
  '      </div>\n      </div>\n      <AnimatePresence>'
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
