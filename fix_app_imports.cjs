const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { AdminPanel } from './components/AdminPanel';",
  "import { AdminPanel } from './components/AdminPanel';\nimport { Shop } from './components/Shop';\nimport { CartScreen } from './components/CartScreen';"
);

fs.writeFileSync('src/App.tsx', code);
