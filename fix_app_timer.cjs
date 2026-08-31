const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const timerCode = `
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

// Insert after imports
content = content.replace(/import \{ ChatBot \} from '\.\/components\/ChatBot';\n/, "import { ChatBot } from './components/ChatBot';\n" + timerCode + '\n');

// Add the timer to the Explore grid
content = content.replace(
  /<img\n\s*src=\{movie\.poster_url \|\| movie\.imageUrl\}\n\s*alt=\{movie\.title\}\n\s*className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"\n\s*loading="lazy"\n\s*\/>/g,
  `<img
                         src={movie.poster_url || movie.imageUrl}
                         alt={movie.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}`
);

// Add the timer to My List grid
content = content.replace(
  /<button \n\s*onClick=\{\(e\) => toggleMyList\(e, movie\)\}/g,
  `{unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}`
);


fs.writeFileSync('src/App.tsx', content);
