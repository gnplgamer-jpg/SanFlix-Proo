const fs = require('fs');
let content = fs.readFileSync('src/components/UnlockModal.tsx', 'utf8');

// Replace 1 with 10
content = content.replace(/coins < 1/g, 'coins < 10');
content = content.replace(/coins >= 1/g, 'coins >= 10');
content = content.replace(/<span className="text-xl font-bold text-white">1<\/span>/, '<span className="text-xl font-bold text-white">10</span>');
content = content.replace(/Unlock Now for 1 Coin/, 'Unlock Now for 10 Coins');
content = content.replace(/<span className="text-zinc-500 font-medium">Coin<\/span>/, '<span className="text-zinc-500 font-medium">Coins</span>');

// Replace 6 hours with 12 hours
content = content.replace(/6 Hours/, '12 Hours');

fs.writeFileSync('src/components/UnlockModal.tsx', content);
