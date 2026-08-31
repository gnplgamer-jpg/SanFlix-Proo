const fs = require('fs');
let code = fs.readFileSync('src/components/Discover.tsx', 'utf-8');

code = `import { TrendingUp, Play, Star } from 'lucide-react';\n` + code;
fs.writeFileSync('src/components/Discover.tsx', code);
console.log("Added imports to Discover.tsx");
