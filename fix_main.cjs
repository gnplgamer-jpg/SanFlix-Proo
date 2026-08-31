const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf-8');

if (!code.includes("virtual:pwa-register")) {
    code = `import { registerSW } from 'virtual:pwa-register';\n` + code;
    fs.writeFileSync('src/main.tsx', code);
    console.log("Added registerSW import to main.tsx");
}
