const fs = require('fs');
let content = fs.readFileSync('src/useCoinSystem.ts', 'utf8');

content = content.replace(
  /if \(!user \|\| coins < 1\) return false;/,
  `if (!user || coins < 10) return false;`
);

content = content.replace(
  /\/\/ 6 hours expiry\s*const expiryTime = Date.now\(\) \+ \(6 \* 60 \* 60 \* 1000\);\s*const newUnlocked = \{ \.\.\.unlockedContent, \[movieId\]: expiryTime \};\s*const newCoins = coins - 1;/,
  `// 12 hours expiry
    const expiryTime = Date.now() + (12 * 60 * 60 * 1000);
    const newUnlocked = { ...unlockedContent, [movieId]: expiryTime };
    const newCoins = coins - 10;`
);

fs.writeFileSync('src/useCoinSystem.ts', content);
