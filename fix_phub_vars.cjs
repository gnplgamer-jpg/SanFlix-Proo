const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace isPHubEnabledState with isPHubEnabled
code = code.replace(/isPHubEnabledState/g, 'isPHubEnabled');

fs.writeFileSync('src/App.tsx', code);
