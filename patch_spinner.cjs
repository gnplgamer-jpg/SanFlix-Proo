const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// Remove AdMob import
content = content.replace(/import \{ AdMob, RewardAdPluginEvents \} from "@capacitor-community\/admob";\n/, '');

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
console.log('SpinnerPage.tsx patched');
