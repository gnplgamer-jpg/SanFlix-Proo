const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace('const text = response.text();', 'const text = response.text;');

fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
