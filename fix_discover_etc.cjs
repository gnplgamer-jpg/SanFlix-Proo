const fs = require('fs');

const timerComponent = `
const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, setTimeLeft] = React.useState(expiryTime - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expiryTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft <= 0) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg border border-red-400/50 flex items-center gap-1 z-20">
      <Clock className="w-3 h-3 animate-pulse" />
      {hours}h {minutes}m {seconds}s
    </div>
  );
};
`;

const processFile = (filename, componentName) => {
  let content = fs.readFileSync(filename, 'utf8');
  
  if (!content.includes('Clock')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, Clock } from 'lucide-react';");
  }
  
  // Add props interface
  content = content.replace(/interface (.*?)Props \{/, 'interface $1Props {\n  unlockedContent?: Record<string, number>;');
  
  // Add to function signature
  content = content.replace(new RegExp(`function ${componentName}\\(\\{(.*?)\\}: ${componentName}Props\\)`), `function ${componentName}({$1, unlockedContent = {}}: ${componentName}Props)`);
  
  // Add CountdownTimer component
  if (!content.includes('CountdownTimer')) {
    content = content.replace(/export function/, timerComponent + '\nexport function');
  }
  
  // Add timer to thumbnails
  // Find <img className="w-full h-full object-cover ... />
  // We can just inject after <img ... />
  content = content.replace(
    /<img\n\s*src=\{movie\.poster_url \|\| movie\.imageUrl\}\n\s*alt=\{movie\.title\}\n\s*className="(.*?)"\n\s*loading="lazy"\n\s*\/>/g,
    `<img
            src={movie.poster_url || movie.imageUrl}
            alt={movie.title}
            className="$1"
            loading="lazy"
          />
          {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
            <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
          )}`
  );
  
  // For Discover it might be slightly different
  content = content.replace(
    /<img\n\s*src=\{item\.poster_url \|\| item\.imageUrl\}\n\s*alt=\{item\.title\}\n\s*className="(.*?)"\n\s*loading="lazy"\n\s*\/>/g,
    `<img
            src={item.poster_url || item.imageUrl}
            alt={item.title}
            className="$1"
            loading="lazy"
          />
          {unlockedContent[item.id || item.firebase_id] && unlockedContent[item.id || item.firebase_id] > Date.now() && (
            <CountdownTimer expiryTime={unlockedContent[item.id || item.firebase_id]} />
          )}`
  );

  fs.writeFileSync(filename, content);
};

processFile('src/components/Discover.tsx', 'Discover');
processFile('src/components/Movies.tsx', 'Movies');
processFile('src/components/TvShows.tsx', 'TvShows');
processFile('src/components/TrendingVideos.tsx', 'TrendingVideos');
processFile('src/components/ActressRail.tsx', 'ActressRail');
