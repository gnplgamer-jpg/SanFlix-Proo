const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = `  const [globalVideo, setGlobalVideo] = useState<{
    url: string;
    movie: any;
    showLanguageSelector: boolean;
    showQualitySelector: boolean;
    showEpisodeSelector: boolean;
  } | null>(null);`;

const replacement1 = `  const [globalVideo, setGlobalVideo] = useState<{
    url: string;
    movie: any;
    showLanguageSelector: boolean;
    showQualitySelector: boolean;
    showEpisodeSelector: boolean;
    fallbackUrls?: string[];
  } | null>(null);

  const reportBrokenLink = async (movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number) => {
    try {
      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieId,
        movieTitle,
        episodeTitle: episodeTitle || '',
        episodeIdx: episodeIdx ?? null,
        failedUrl,
        timestamp: new Date().toISOString(),
        resolved: false
      });
      alert('Broken link reported to admin successfully.');
    } catch (err) {
      console.error('Failed to report', err);
    }
  };`;

code = code.replace(target1, replacement1);

code = code.replace(/setGlobalVideo\(\{ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false \}\)/g, 
  'setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, movie) })');

code = code.replace(/setGlobalVideo\(\{ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false \}\)/g, 
  'setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, nextMovie) })');

const targetHelper = `  const [nextVideoCountdown, setNextVideoCountdown] = useState<{`;

const replacementHelper = `  const getFallbacks = (url: string, movie: any) => {
    if (!movie) return [];
    if (url === movie.streaming_link_1) {
      return [movie.streaming_link_2, movie.streaming_link_3, movie.streaming_link_4].filter(Boolean);
    }
    if (movie.episodes) {
      const ep = movie.episodes.find((e: any) => e.url === url);
      if (ep) {
         return [ep.url_2, ep.url_3, ep.url_4].filter(Boolean);
      }
    }
    return [];
  };
  
  const [nextVideoCountdown, setNextVideoCountdown] = useState<{`;

code = code.replace(targetHelper, replacementHelper);

const targetProps = `                onEnded={() => {`;
const replaceProps = `                fallbackUrls={globalVideo.fallbackUrls}
                onReport={() => {
                   let epTitle = '';
                   let epIdx = -1;
                   if (globalVideo.movie?.episodes) {
                     const idx = globalVideo.movie.episodes.findIndex((e: any) => e.url === globalVideo.url || e.url_2 === globalVideo.url || e.url_3 === globalVideo.url || e.url_4 === globalVideo.url);
                     if (idx !== -1) {
                        epTitle = globalVideo.movie.episodes[idx].title;
                        epIdx = idx;
                     }
                   }
                   reportBrokenLink(globalVideo.movie?.id || globalVideo.movie?.firebase_id, globalVideo.movie?.title, globalVideo.url, epTitle, epIdx === -1 ? undefined : epIdx);
                }}
                onEnded={() => {`;

code = code.replace(targetProps, replaceProps);

fs.writeFileSync('src/App.tsx', code);
