const fs = require('fs');
let content = fs.readFileSync('src/components/PlayerModal.tsx', 'utf8');

// Remove isSubscribed from props interface
content = content.replace(/isSubscribed\?: boolean;\n/, '');

// Remove isSubscribed from function signature
content = content.replace(/isSubscribed = false, /, '');

// Remove isSubscribed from unlock check
content = content.replace(/if \(!isSubscribed && !isUnlocked && onRequireUnlock\)/, 'if (!isUnlocked && onRequireUnlock)');

fs.writeFileSync('src/components/PlayerModal.tsx', content);
