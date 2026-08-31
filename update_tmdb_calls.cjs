const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "https://api.themoviedb.org/3/search/${sug.type === 'tv' ? 'tv' : 'movie'}?api_key=${tmdbKey}&query=${encodeURIComponent(sug.title)}",
  "https://api.themoviedb.org/3/search/${sug.type === 'tv' ? 'tv' : 'movie'}?api_key=${tmdbKey}&query=${encodeURIComponent(sug.title)}&include_adult=true&language=en-US"
);

code = code.replace(
  "https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${tmdbKey}",
  "https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${tmdbKey}&include_adult=true&language=en-US"
);

code = code.replace(
  "https://api.themoviedb.org/3/find/${externalId}?external_source=imdb_id&api_key=${tmdbKey}",
  "https://api.themoviedb.org/3/find/${externalId}?external_source=imdb_id&api_key=${tmdbKey}&language=en-US"
);

code = code.replace(
  "https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${tmdbKey}",
  "https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${tmdbKey}&language=en-US"
);

code = code.replace(
  "https://api.themoviedb.org/3/person/${id}?api_key=${tmdbKey}",
  "https://api.themoviedb.org/3/person/${id}?api_key=${tmdbKey}&language=en-US"
);

code = code.replace(
  "https://api.themoviedb.org/3/${type}/${tmdbId}?append_to_response=videos,credits&api_key=${tmdbKey}",
  "https://api.themoviedb.org/3/${type}/${tmdbId}?append_to_response=credits,videos,images&api_key=${tmdbKey}&language=en-US"
);

fs.writeFileSync('server.ts', code);
