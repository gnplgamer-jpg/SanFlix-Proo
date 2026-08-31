const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  ") : (\n      {error && (",
  ") : (\n      <>\n      {error && ("
);

code = code.replace(
  "        </div>\n      )}\n      {/* Floating Bulk Action Bar */}",
  "        </div>\n      </>)}\n      {/* Floating Bulk Action Bar */}"
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
