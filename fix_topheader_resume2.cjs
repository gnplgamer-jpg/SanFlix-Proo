const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "fallbackUrls: [], initialTime });",
  "fallbackUrls: getFallbacks(lastUrl, latestMovie), initialTime });"
);

fs.writeFileSync('src/App.tsx', code);
