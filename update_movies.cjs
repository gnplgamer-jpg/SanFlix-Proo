const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace("import { Search, Filter, Calendar } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { Search, Filter, Calendar } from 'lucide-react';");

code = code.replace(/<img\s+src=\{movie\.poster_url \|\| movie\.imageUrl\}\s+alt=\{movie\.title\}\s+className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"\s+loading="lazy"\s+\/>/g, 
  '<BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />');

fs.writeFileSync('src/components/Movies.tsx', code);
console.log('Updated Movies.tsx');
