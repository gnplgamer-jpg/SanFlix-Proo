const fs = require('fs');

const files = [
  'src/components/Movies.tsx',
  'src/components/TvShows.tsx',
  'src/components/Discover.tsx',
  'src/components/MovieRail.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // Add TrendingUp to lucide-react imports if not there
    if (!code.includes('TrendingUp')) {
      code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, TrendingUp } from 'lucide-react';");
    }
    
    // Insert POPULAR tag in the top-2 right-2 div
    const target = `<div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">`;
    const popularTagCode = `<div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                {movie.rating && parseFloat(movie.rating) >= 8.5 && (
                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5">
                     <TrendingUp className="w-2.5 h-2.5" />
                     POPULAR
                   </div>
                )}`;
                
    if (!code.includes('POPULAR')) {
       code = code.replace(target, popularTagCode);
    }
    
    fs.writeFileSync(file, code);
  }
});
console.log("Done adding tags");
