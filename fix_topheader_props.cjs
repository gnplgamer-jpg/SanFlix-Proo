const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /onCartClick=\{\(\) => setActiveTab\('cart'\)\}/,
  "onCartClick={() => setActiveTab('cart')}\n              onGamesClick={() => setActiveTab('games')}"
);

fs.writeFileSync('src/App.tsx', content);
