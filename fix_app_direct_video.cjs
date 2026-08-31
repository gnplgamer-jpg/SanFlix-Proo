const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const onPlayVideoHtml = `            onPlayVideo={(url, movie) => {
              const movieId = movie?.id || movie?.firebase_id;
              let initialTime = 0;
              if (movieId) {
                const saved = localStorage.getItem('SANFLIX_PROGRESS');
                if (saved) {
                  const progressData = JSON.parse(saved);
                  if (progressData[movieId]) {
                    initialTime = progressData[movieId].currentTime;
                  }
                }
              }
              setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, movie), initialTime });
            }}`;

code = code.replace(
  "            onPlayVideo={(url, movie) => setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, movie) })}",
  onPlayVideoHtml
);

const directVideoPlayerRenderHtml = `              <DirectVideoPlayer
                url={globalVideo.url}
                title={globalVideo.movie?.title || 'Unknown'}
                initialTime={globalVideo.initialTime}
                onClose={() => {`;

code = code.replace(
  `              <DirectVideoPlayer
                url={globalVideo.url}
                title={globalVideo.movie?.title || 'Unknown'}
                onClose={() => {`,
  directVideoPlayerRenderHtml
);

fs.writeFileSync('src/App.tsx', code);
