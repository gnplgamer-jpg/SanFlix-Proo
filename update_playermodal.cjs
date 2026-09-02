const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf8');

if (!code.includes("import { BlurImage }")) {
  code = code.replace("import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipForward, Clock, Subtitles, Layers, SkipBack, Share2, PictureInPicture, Smartphone, AlertTriangle } from 'lucide-react';", "import { BlurImage } from './BlurImage';\nimport { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipForward, Clock, Subtitles, Layers, SkipBack, Share2, PictureInPicture, Smartphone, AlertTriangle } from 'lucide-react';");
}

code = code.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"\s+loading="lazy"\s*\/>/g, 
  '<BlurImage src={$1} alt={$2} className="$3" />');

code = code.replace(/<img\s+src=\{([^}]+)\}\s+className="([^"]+)"\s+alt=\{([^}]+)\}\s*\/>/g, 
  '<BlurImage src={$1} className="$2" alt={$3} />');

fs.writeFileSync('src/components/PlayerModal.tsx', code);
console.log('Updated PlayerModal.tsx');
