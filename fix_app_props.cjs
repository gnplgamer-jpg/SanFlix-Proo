const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/<Discover content=\{filteredContent\} onSelectMovie=\{handleSelectMovie\} \/>/, '<Discover content={filteredContent} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />');
content = content.replace(/<Movies movies=\{filteredContent\} onSelectMovie=\{handleSelectMovie\} \/>/, '<Movies movies={filteredContent} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />');
content = content.replace(/<TvShows shows=\{filteredContent\} onSelectMovie=\{handleSelectMovie\} \/>/, '<TvShows shows={filteredContent} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />');
content = content.replace(/<TrendingVideos videos=\{trendingContent\} onSelectMovie=\{handleSelectMovie\} \/>/, '<TrendingVideos videos={trendingContent} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />');
content = content.replace(/<ActressRail actress=\{selectedActress\} movies=\{moviesList\} onSelectMovie=\{handleSelectMovie\} \/>/, '<ActressRail actress={selectedActress} movies={moviesList} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />');

fs.writeFileSync('src/App.tsx', content);
