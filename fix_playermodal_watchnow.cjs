const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const effectCode = `  const [adProduct, setAdProduct] = useState<any>(null);

  useEffect(() => {
    const fetchAd = async () => {`;
    
const newEffectCode = `  const [adProduct, setAdProduct] = useState<any>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  useEffect(() => {
    const movieId = movie?.id || movie?.firebase_id;
    if (movieId) {
      const saved = localStorage.getItem('SANFLIX_PROGRESS');
      if (saved) {
        const progressData = JSON.parse(saved);
        if (progressData[movieId] && progressData[movieId].url) {
          setLastUrl(progressData[movieId].url);
        }
      }
    }
  }, [movie]);

  useEffect(() => {
    const fetchAd = async () => {`;

code = code.replace(effectCode, newEffectCode);

const watchNowBtn = `                  <button 
                    onClick={() => handleActionClick(movie.streaming_link_1)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" /> Watch Now
                  </button>`;

const newWatchNowBtn = `                  <button 
                    onClick={() => handleActionClick(lastUrl || movie.streaming_link_1)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" /> {lastUrl ? 'Resume' : 'Watch Now'}
                  </button>`;
                  
code = code.replace(watchNowBtn, newWatchNowBtn);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
