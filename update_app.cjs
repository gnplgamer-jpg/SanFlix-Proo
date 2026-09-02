const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { BlurImage }")) {
  code = code.replace("import { TrendingVideos } from './components/TrendingVideos';", "import { BlurImage } from './components/BlurImage';\nimport { TrendingVideos } from './components/TrendingVideos';");
}

code = code.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"\s+loading="lazy"\s*\/>/g, 
  '<BlurImage src={$1} alt={$2} className="$3" />');

// also some are without loading="lazy"
code = code.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"\s*\/>/g, 
  '<BlurImage src={$1} alt={$2} className="$3" />');

// there is one with src="https://..."
// skip replacing all <img for now if it's not starting with src={
fs.writeFileSync('src/App.tsx', code);
console.log('Updated App.tsx');
