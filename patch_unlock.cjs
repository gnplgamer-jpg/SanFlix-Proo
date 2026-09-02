const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The issue is handleSelectMovie relies on unlockedContent which might be stale.
// We can modify handleSelectMovie to accept an override for unlock checking, or we can just bypass the check if we already just unlocked it.
// Actually, `unlockMovie` updates `unlockedContent`. We can change handleSelectMovie to accept an `ignoreLock` parameter.

// 1. Update handleSelectMovie signature and logic
code = code.replace(
  'const handleSelectMovie = (movie: any) => {',
  'const handleSelectMovie = (movie: any, ignoreLock: boolean = false) => {'
);
code = code.replace(
  'if (!isPremium && !isUnlocked) {',
  'if (!isPremium && !isUnlocked && !ignoreLock) {'
);

// 2. Update onUnlock in UnlockModal props
code = code.replace(
  '              await unlockMovie(movieId);\n              handleSelectMovie(unlockingMovie);\n            }}',
  '              await unlockMovie(movieId);\n              handleSelectMovie(unlockingMovie, true);\n            }}'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Unlock logic patched');
