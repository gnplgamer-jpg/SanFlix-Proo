const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

code = code.replace(
  /<button\s+key=\{channel.id\}\s+onClick=\{\(\) => \{\s+setCurrentChannel\(channel\);\s+window.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\s+\}\}\s+className=\{\`flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group \$\{/g,
  `<div\n                key={channel.id}\n                onClick={() => {\n                  setCurrentChannel(channel);\n                  window.scrollTo({ top: 0, behavior: 'smooth' });\n                }}\n                className={\`cursor-pointer flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group \${`
);

code = code.replace(
  /<\/button>\s+<\/div>\s+<\/button>\s+\}\)\}\s+<\/div>/g,
  `</button>\n                </div>\n              </div>\n            ))}\n          </div>`
);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log("Fixed nesting error");
