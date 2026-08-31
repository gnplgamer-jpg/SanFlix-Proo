const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const target = `      const queryValue = tmdbQuery || formData.tmdb_id;
      const isNumeric = /^\\d+$/.test(queryValue.trim());
      const isImdb = /^tt\\d+$/.test(queryValue.trim().toLowerCase());
      
      let movieId = queryValue;
      let mediaType = 'movie'; // Default to movie

      if (isImdb) {`;

const replacement = `      let rawQuery = (tmdbQuery || formData.tmdb_id).trim();
      let forceMediaType = null;
      
      // Parse URLs if provided
      const imdbUrlMatch = rawQuery.match(/imdb\\.com\\/title\\/(tt\\d+)/i);
      if (imdbUrlMatch) {
        rawQuery = imdbUrlMatch[1];
      } else {
        const tmdbUrlMatch = rawQuery.match(/themoviedb\\.org\\/(movie|tv)\\/(\\d+)/i);
        if (tmdbUrlMatch) {
          forceMediaType = tmdbUrlMatch[1];
          rawQuery = tmdbUrlMatch[2];
        }
      }

      const queryValue = rawQuery;
      const isNumeric = /^\\d+$/.test(queryValue);
      const isImdb = /^tt\\d+$/.test(queryValue.toLowerCase());
      
      let movieId = queryValue;
      let mediaType = forceMediaType || 'movie'; // Default to movie

      if (isImdb) {`;

code = code.replace(target, replacement);

code = code.replace(/placeholder="Scrape by Title or TMDB ID..."/g, 'placeholder="Scrape by Title, ID, or Link (TMDb/IMDb)..."');
code = code.replace(/placeholder="Scrape by Title, TMDB ID, or IMDb ID..."/g, 'placeholder="Scrape by Title, ID, or Link (TMDb/IMDb)..."');
code = code.replace(/TMDb \\\/ IMDb ID/g, 'TMDb / IMDb ID or Link');
code = code.replace(/>TMDb ID</g, '>TMDb / IMDb ID or Link<');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
