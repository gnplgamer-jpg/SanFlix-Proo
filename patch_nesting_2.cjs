const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// The opening tag was correctly replaced? Let's check
if (!code.includes('<div\n                key={channel.id}')) {
   code = code.replace(
      /<button\n\s*key=\{channel\.id\}\n\s*onClick=\{[\s\S]*?className=\{[\s\S]*?\}>/g,
      (match) => {
         return match.replace('<button', '<div').replace('className={`flex', 'className={`cursor-pointer flex');
      }
   );
}

// The closing tag
code = code.replace(
  /<\/button>\s*<\/div>\s*<\/button>\s*\}\)\}\s*<\/div>/g,
  `</button>\n                </div>\n              </div>\n            ))}\n          </div>`
);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log("Fixed nesting error part 2");
