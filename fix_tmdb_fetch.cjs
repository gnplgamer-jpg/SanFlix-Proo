const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

code = code.replace(
  "fetch(\`/api/tmdb/details/\${movie.tmdb_id}\`)",
  "fetch(\`/api/tmdb/details/\${encodeURIComponent(movie.tmdb_id.toString().trim())}?type=\${movie.eps_count > 0 || (movie.episodes && movie.episodes.length > 0) ? 'tv' : 'movie'}\`)"
);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
console.log("Fixed fetch URL");
