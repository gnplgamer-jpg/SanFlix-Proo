const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const target = `      // Parse URLs if provided
      const imdbUrlMatch = rawQuery.match(/imdb\\.com\\/title\\/(tt\\d+)/i);
      if (imdbUrlMatch) {
        rawQuery = imdbUrlMatch[1];
      } else {
        const tmdbUrlMatch = rawQuery.match(/themoviedb\\.org\\/(movie|tv)\\/(\\d+)(?:\\/season\\/(\\d+))?/i);`;

const replacement = `      // Parse URLs if provided
      const imdbUrlMatch = rawQuery.match(/imdb\\.com\\/title\\/(tt\\d+)/i);
      if (imdbUrlMatch) {
        const seasonMatch = rawQuery.match(/[?&]season=(\\d+)/i);
        rawQuery = imdbUrlMatch[1];
        if (seasonMatch) {
          targetSeason = parseInt(seasonMatch[1]);
          forceMediaType = 'tv';
        }
      } else {
        const tmdbUrlMatch = rawQuery.match(/themoviedb\\.org\\/(movie|tv)\\/(\\d+)(?:\\/season\\/(\\d+))?/i);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
