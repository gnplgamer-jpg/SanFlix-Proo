const fs = require('fs');
let code = fs.readFileSync('src/components/Discover.tsx', 'utf-8');

code = code.replace(
  /movie\.rating/g,
  "video.rating"
);

if (!code.includes('TrendingUp')) {
  code = code.replace(
    /import \{ (.*) \} from 'lucide-react';/,
    "import { $1, TrendingUp } from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/Discover.tsx', code);
console.log("Fixed Discover.tsx");
