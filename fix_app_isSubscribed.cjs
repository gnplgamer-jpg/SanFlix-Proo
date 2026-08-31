const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /if \(!isSubscribed\) \{\n\s*if \(!isUnlocked\(movieId\)\) \{\n\s*setUnlockingMovie\(latestMovie\);\n\s*return;\n\s*\}\n\s*\}/g,
  `if (!isUnlocked(movieId)) {
                          setUnlockingMovie(latestMovie);
                          return;
                      }`
);

content = content.replace(
  /if \(!isSubscribed\) \{\n\s*const movieId = movie\.id \|\| movie\.firebase_id;\n\s*if \(!isUnlocked\(movieId\)\) \{\n\s*setUnlockingMovie\(movie\);\n\s*return;\n\s*\}\n\s*\}/g,
  `const movieId = movie.id || movie.firebase_id;
                                    if (!isUnlocked(movieId)) {
                                      setUnlockingMovie(movie);
                                      return;
                                    }`
);

fs.writeFileSync('src/App.tsx', content);
