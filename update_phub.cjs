const fs = require('fs');
let code = fs.readFileSync('src/components/PhubAPIContent.tsx', 'utf8');

if (!code.includes("import { BlurImage }")) {
  code = code.replace("import { Flame, Clock, Play } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { Flame, Clock, Play } from 'lucide-react';");
}

code = code.replace(/<img\s+src=\{imgUrl\}\s+alt=\{title\}\s+className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"\s+loading="lazy"\s*\/>/g, 
  '<BlurImage src={imgUrl} alt={title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />');

fs.writeFileSync('src/components/PhubAPIContent.tsx', code);
console.log('Updated PhubAPIContent.tsx');
