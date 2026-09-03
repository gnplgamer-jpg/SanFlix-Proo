const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex2 = /value=\{shopForm\.([a-zA-Z0-9_]+)\}/g;
code = code.replace(regex2, 'value={shopForm.$1 || ""}');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("All shopForm inputs fixed");
