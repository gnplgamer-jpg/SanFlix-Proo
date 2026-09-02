const fs = require('fs');
let code = fs.readFileSync('src/components/Discover.tsx', 'utf8');

if (!code.includes("import { BlurImage }")) {
  code = code.replace("import { Search, Flame, TrendingUp, Sparkles, Filter, X, ChevronRight, Hash, Play, Star, Clock } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { Search, Flame, TrendingUp, Sparkles, Filter, X, ChevronRight, Hash, Play, Star, Clock } from 'lucide-react';");
}

code = code.replace(/<img\s*src=\{movie\.poster_url \|\| movie\.imageUrl\}\s*alt=\{movie\.title\}\s*className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"\s*loading="lazy"\s*\/>/g, 
  '<BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />');

code = code.replace(/<img\s*src=\{video\.poster_url \|\| video\.imageUrl\}\s*alt=\{video\.title\}\s*className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"\s*loading="lazy"\s*\/>/g, 
  '<BlurImage src={video.poster_url || video.imageUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />');

fs.writeFileSync('src/components/Discover.tsx', code);
console.log('Updated Discover.tsx');
