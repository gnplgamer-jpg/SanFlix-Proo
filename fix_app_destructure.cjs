const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const \{ coins, isUnlocked, unlockMovie, addCoins \} = useCoinSystem\(user\);/,
  `const { coins, isUnlocked, unlockedContent, unlockMovie, addCoins } = useCoinSystem(user);`
);

fs.writeFileSync('src/App.tsx', content);
