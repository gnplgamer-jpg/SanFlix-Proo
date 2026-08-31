const fs = require('fs');
let code = fs.readFileSync('src/components/TvShows.tsx', 'utf-8');

code = code.replace(
  /movie\.rating/g,
  "show.rating"
);

fs.writeFileSync('src/components/TvShows.tsx', code);
console.log("Fixed TvShows.tsx");
