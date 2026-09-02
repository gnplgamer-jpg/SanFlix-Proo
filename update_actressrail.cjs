const fs = require('fs');
let code = fs.readFileSync('src/components/ActressRail.tsx', 'utf8');

if (!code.includes("import { BlurImage }")) {
  code = code.replace("import { Sparkles, ChevronRight, ChevronLeft, Clock } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { Sparkles, ChevronRight, ChevronLeft, Clock } from 'lucide-react';");
}

code = code.replace(/<img\s+src=\{actress\.imageUrl\}\s+alt=\{actress\.name\}\s+className="w-full h-full object-cover"\s+loading="lazy"\s*\/>/g, 
  '<BlurImage src={actress.imageUrl} alt={actress.name} className="w-full h-full object-cover" />');

fs.writeFileSync('src/components/ActressRail.tsx', code);
console.log('Updated ActressRail.tsx');
