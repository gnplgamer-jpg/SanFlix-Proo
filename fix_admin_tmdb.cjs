const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const replacement = `      const isNumeric = /^\\d+$/.test(queryValue.trim());
      const isImdb = /^tt\\d+$/.test(queryValue.trim().toLowerCase());
      
      let movieId = queryValue;
      let mediaType = 'movie'; // Default to movie

      if (isImdb) {
        // Search by IMDb ID
        const findRes = await fetch(\`/api/tmdb/find/\${queryValue.trim().toLowerCase()}\`);
        const findData = await findRes.json();
        
        if (findRes.ok && ((findData.movie_results && findData.movie_results.length > 0) || (findData.tv_results && findData.tv_results.length > 0))) {
          const result = (findData.movie_results && findData.movie_results.length > 0) ? findData.movie_results[0] : findData.tv_results[0];
          movieId = result.id.toString();
          mediaType = result.media_type || (findData.movie_results && findData.movie_results.length > 0 ? 'movie' : 'tv');
        } else {
          throw new Error('No matching content found for this IMDb ID');
        }
      } else if (!isNumeric) {`;

code = code.replace(/      const isNumeric = \/^\\[\\d\\]\+\$\/.test\(queryValue.trim\(\)\);\n      \n      let movieId = queryValue;\n      let mediaType = 'movie'; \/\/ Default to movie\n\n      if \(\!isNumeric\) \{/, replacement);

code = code.replace(/placeholder="Scrape by Title or TMDB ID..."/, 'placeholder="Scrape by Title, TMDB ID, or IMDb ID..."');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
