const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/ \) : activeTab === 'ludo' \? \(\s*\) : activeTab === 'explore' \? \(/g, " ) : activeTab === 'explore' ? (");

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx syntax patched');
