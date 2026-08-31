const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/import \{ Info, Play/, 'import { Info, Play, Clock');

fs.writeFileSync('src/App.tsx', content);
