const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /value=\{formData\.([a-zA-Z0-9_]+)\}/g;
code = code.replace(regex, 'value={formData.$1 || ""}');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("All formData inputs fixed");
