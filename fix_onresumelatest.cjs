const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                    if (lastUrl) {
                      setGlobalVideo({ url: lastUrl, movie: latestMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(lastUrl, latestMovie), initialTime });
                    } else {
                      handleSelectMovie(latestMovie);
                    }`;

const newStr = `                    const fallbackUrl = lastUrl || latestMovie.streaming_link_1 || (latestMovie.episodes && latestMovie.episodes.length > 0 ? latestMovie.episodes[0].url : null);
                    if (fallbackUrl) {
                      setGlobalVideo({ 
                        url: fallbackUrl, 
                        movie: latestMovie, 
                        showLanguageSelector: false, 
                        showQualitySelector: false, 
                        showEpisodeSelector: false, 
                        fallbackUrls: getFallbacks(fallbackUrl, latestMovie), 
                        initialTime 
                      });
                    } else {
                      handleSelectMovie(latestMovie);
                    }`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
