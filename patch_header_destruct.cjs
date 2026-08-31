const fs = require('fs');
let content = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');

content = content.replace(
  /onCartClick, onResumeLatest, hasContinueWatching, coins = 0, onCoinClick \}: TopHeaderProps\)/,
  "onCartClick, onResumeLatest, onGamesClick, hasContinueWatching, coins = 0, onCoinClick }: TopHeaderProps)"
);

fs.writeFileSync('src/components/TopHeader.tsx', content);
