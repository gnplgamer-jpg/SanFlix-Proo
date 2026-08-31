const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/       if \(selectedCategory === '🔥 18\+ Hub'\) \{\n          result = result.filter\(m => m.ad_gate\);\n       \}/, 
  `       if (selectedCategory === '🔥 18+ Hub') {
          result = result.filter(m => m.ad_gate);
       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);
       }`);

fs.writeFileSync('src/App.tsx', code);
