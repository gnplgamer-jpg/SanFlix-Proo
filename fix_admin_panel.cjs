const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  /onClick=\{scourCatalogTMDbApi\}/g,
  "onClick={() => scourCatalogTMDbApi()}"
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Fixed AdminPanel.tsx");
