const fs = require('fs');

const file = 'src/components/TrendingVideos.tsx';
let code = fs.readFileSync(file, 'utf-8');

// Add TrendingUp to lucide-react imports if not there
if (!code.includes('TrendingUp')) {
  code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, TrendingUp } from 'lucide-react';");
}

const target = `<div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-bl-xl shadow-md z-10">
                    #{idx + 1}
                  </div>`;
const popularTagCode = `<div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-bl-xl shadow-md z-10">
                    #{idx + 1}
                  </div>
                  {movie.rating && parseFloat(movie.rating) >= 8.5 && (
                    <div className="absolute top-8 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded-l text-[10px] font-bold shadow-lg flex items-center gap-0.5 z-10 mt-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      POPULAR
                    </div>
                  )}`;
                  
if (!code.includes('POPULAR')) {
   code = code.replace(target, popularTagCode);
   fs.writeFileSync(file, code);
}

console.log("Trending updated");
