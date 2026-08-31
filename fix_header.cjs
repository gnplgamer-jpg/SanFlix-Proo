const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// The header container starts at:
// <div className="p-4 flex items-center justify-between bg-zinc-900 border-b border-zinc-800">
// and ends before:
// <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center relative">

content = content.replace(
  /          <\/button>\n        <\/div>\n\n      <div className="flex-1 overflow-y-auto/,
  '          </button>\n        </div>\n      </div>\n\n      <div className="flex-1 overflow-y-auto'
);

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
