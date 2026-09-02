const fs = require('fs');
let code = fs.readFileSync('src/components/Discover.tsx', 'utf8');

code = code.replace(
  "import { Search, Filter, History, Star, PlayCircle, Eye, Lock, Unlock, Clock, TrendingUp, ThumbsUp } from 'lucide-react';",
  "import { Search, Filter, History, Star, PlayCircle, Eye, Lock, Unlock, Clock, TrendingUp, ThumbsUp } from 'lucide-react';\nimport { AdBanner } from './AdBanner';"
);

code = code.replace(
  /{filteredContent.length === 0 \? \(/,
  `<div className="mb-4"><AdBanner /></div>\n        {filteredContent.length === 0 ? (`
);

fs.writeFileSync('src/components/Discover.tsx', code);
console.log('Patched Discover.tsx');
