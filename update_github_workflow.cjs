const fs = require('fs');
let content = fs.readFileSync('.github/workflows/build-apk.yml', 'utf8');

// Update to use the resources folder if assets is empty
content = content.replace(
  /npx @capacitor\/assets generate --android \|\| true/,
  'npx @capacitor/assets generate --android --assetPath resources || npx @capacitor/assets generate --android --assetPath assets || true'
);

fs.writeFileSync('.github/workflows/build-apk.yml', content);
