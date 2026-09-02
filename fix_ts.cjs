const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

code = code.replace(/let currentCh = \{\};/g, 'let currentCh: Partial<Channel> = {};');

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed TS error');
