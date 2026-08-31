const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetOnResume = `              onResumeLatest={() => {
                if (continueWatchingIds.length > 0) {
                  const latestMovie = filteredContent.find(m => m.firebase_id === continueWatchingIds[0]) || moviesList.find(m => m.firebase_id === continueWatchingIds[0]);
                  if (latestMovie) handleSelectMovie(latestMovie);
                }
              }}`;

const newOnResume = `              onResumeLatest={() => {
                if (continueWatchingIds.length > 0) {
                  const movieId = continueWatchingIds[0];
                  const latestMovie = filteredContent.find(m => m.firebase_id === movieId) || moviesList.find(m => m.firebase_id === movieId);
                  if (latestMovie) {
                    const saved = localStorage.getItem('SANFLIX_PROGRESS');
                    let initialTime = 0;
                    let lastUrl = null;
                    if (saved) {
                      const progressData = JSON.parse(saved);
                      if (progressData[movieId]) {
                        initialTime = progressData[movieId].currentTime || 0;
                        lastUrl = progressData[movieId].url;
                      }
                    }
                    if (lastUrl) {
                      setGlobalVideo({ url: lastUrl, movie: latestMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: [], initialTime });
                    } else {
                      handleSelectMovie(latestMovie);
                    }
                  }
                }
              }}`;

code = code.replace(targetOnResume, newOnResume);

fs.writeFileSync('src/App.tsx', code);
