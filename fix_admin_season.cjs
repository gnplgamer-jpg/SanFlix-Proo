const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const target1 = `      let rawQuery = (tmdbQuery || formData.tmdb_id).trim();
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
      }`;

const replacement1 = `      let rawQuery = (tmdbQuery || formData.tmdb_id).trim();
      let forceMediaType = null;
      let targetSeason = null;
      
      // Parse URLs if provided
      const imdbUrlMatch = rawQuery.match(/imdb\\.com\\/title\\/(tt\\d+)/i);
      if (imdbUrlMatch) {
        rawQuery = imdbUrlMatch[1];
      } else {
        const tmdbUrlMatch = rawQuery.match(/themoviedb\\.org\\/(movie|tv)\\/(\\d+)(?:\\/season\\/(\\d+))?/i);
        if (tmdbUrlMatch) {
          forceMediaType = tmdbUrlMatch[1];
          rawQuery = tmdbUrlMatch[2];
          if (tmdbUrlMatch[3]) {
            targetSeason = parseInt(tmdbUrlMatch[3]);
          }
        }
      }`;

code = code.replace(target1, replacement1);


const target2 = `      let trailerKey = '';
      if (movie.videos && movie.videos.results) {
         const trailer = movie.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
         if (trailer) trailerKey = trailer.key;
      }
      
      let primaryGenre = formData.mapped_category_rail;`;

const replacement2 = `      let trailerKey = '';
      if (movie.videos && movie.videos.results) {
         const trailer = movie.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
         if (trailer) trailerKey = trailer.key;
      }

      let episodesList = formData.episodes;
      let seasonCount = formData.season_count;
      let epsCount = formData.eps_count;
      
      // If a specific season was requested from URL, fetch its episodes
      if (mediaType === 'tv' && targetSeason !== null) {
        try {
          const seasonRes = await fetch(\`/api/tmdb/season/\${movieId}/\${targetSeason}\`);
          if (seasonRes.ok) {
            const seasonData = await seasonRes.json();
            if (seasonData.episodes && seasonData.episodes.length > 0) {
              episodesList = seasonData.episodes.map((ep: any) => ({
                title: \`S\${targetSeason} E\${ep.episode_number} - \${ep.name}\`,
                url: '',
                download_url: ''
              }));
              seasonCount = targetSeason;
              epsCount = seasonData.episodes.length;
            }
          }
        } catch(e) {
          console.error("Failed to fetch season episodes:", e);
        }
      } else if (mediaType === 'tv' && movie.number_of_seasons) {
        seasonCount = movie.number_of_seasons;
        epsCount = movie.number_of_episodes || 0;
      }
      
      let primaryGenre = formData.mapped_category_rail;`;

code = code.replace(target2, replacement2);


const target3 = `        release_date: movie.release_date || movie.first_air_date || '',
        trailer_id: trailerKey || prev.trailer_id,
        mapped_category_rail: primaryGenre,
        ad_gate: prev.ad_gate 
      }));`;

const replacement3 = `        release_date: movie.release_date || movie.first_air_date || '',
        trailer_id: trailerKey || prev.trailer_id,
        mapped_category_rail: primaryGenre,
        ad_gate: prev.ad_gate,
        episodes: episodesList || prev.episodes,
        season_count: seasonCount || prev.season_count,
        eps_count: epsCount || prev.eps_count
      }));`;

code = code.replace(target3, replacement3);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
