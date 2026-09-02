const fs = require('fs');
let code = fs.readFileSync('src/components/TvShows.tsx', 'utf8');

code = code.replace("import { Search, Filter, Play, Star } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { Search, Filter, Play, Star } from 'lucide-react';");

code = code.replace(/<img\s+src=\{show\.poster_url \|\| show\.imageUrl\}\s+alt=\{show\.title\}\s+className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"\s+loading="lazy"\s+\/>/g, 
  '<BlurImage src={show.poster_url || show.imageUrl} alt={show.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />');

fs.writeFileSync('src/components/TvShows.tsx', code);
console.log('Updated TvShows.tsx');
