const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `<TrendingVideos />`;

const replace = `<TrendingVideos 
            appMovies={filteredContent} 
            onSelectMovie={handleSelectMovie}
            onPlayUrl={(url, title, movie) => {
              setGlobalVideo({
                url,
                movie: movie || { title } as any,
                showLanguageSelector: false,
                showQualitySelector: false,
                showEpisodeSelector: false,
                fallbackUrls: []
              });
            }}
          />`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
