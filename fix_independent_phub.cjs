const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

code = code.replace(
  "{isAdultEnabled && (\n          <div className=\"bg-gradient-to-r from-orange-600/20",
  "<div className=\"bg-gradient-to-r from-orange-600/20 mt-6"
);

code = code.replace(
  "          </div>\n        )}",
  "          </div>"
);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
