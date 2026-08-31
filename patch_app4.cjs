const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { BiometricLock }')) {
  content = content.replace(
    /import \{ SpinnerPage \} from '\.\/components\/SpinnerPage';/,
    "import { SpinnerPage } from './components/SpinnerPage';\nimport { BiometricLock } from './components/BiometricLock';"
  );
}

fs.writeFileSync('src/App.tsx', content);
