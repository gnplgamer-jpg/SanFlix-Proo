const fs = require('fs');
let content = fs.readFileSync('src/components/MovieRail.tsx', 'utf8');

// Add to props
content = content.replace(/myListIds\?: string\[\];\n/, 'myListIds?: string[];\n  unlockedContent?: Record<string, number>;\n');

// Add to signature
content = content.replace(/myListIds = \[\], continueWatchingIds = \[\] \}: MovieRailProps/, 'myListIds = [], continueWatchingIds = [], unlockedContent = {} }: MovieRailProps');

// Add a CountdownTimer component at the top
const timerComponent = `
const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

  useEffect(() => {
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

content = content.replace(/const LazyImage =/, timerComponent + '\nconst LazyImage =');

// Add the timer overlay to the thumbnail
// The thumbnail has <div className="relative aspect-[2/3]...
// We find <LazyImage src={...
content = content.replace(
  /<LazyImage\n\s*src=\{movie\.poster_url \|\| movie\.imageUrl\}\n\s*alt=\{movie\.title\}\n\s*className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"\n\s*\/>/g,
  `<LazyImage
                          src={movie.poster_url || movie.imageUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                          <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                        )}`
);

fs.writeFileSync('src/components/MovieRail.tsx', content);
