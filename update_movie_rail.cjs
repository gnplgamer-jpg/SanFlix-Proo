const fs = require('fs');

let content = fs.readFileSync('src/components/MovieRail.tsx', 'utf8');

// Remove LazyImage component definition
content = content.replace(/const LazyImage = \([\s\S]*?^\};\n\n/m, '');

// Import BlurImage
content = content.replace("import { Play, Star", "import { BlurImage } from './BlurImage';\nimport { Play, Star");

// Replace <LazyImage with <BlurImage
content = content.replace(/<LazyImage/g, '<BlurImage');

fs.writeFileSync('src/components/MovieRail.tsx', content);
console.log('Updated MovieRail.tsx');
