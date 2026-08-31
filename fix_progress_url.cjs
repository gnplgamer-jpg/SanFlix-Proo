const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "progressData[movieId] = { currentTime, duration };",
  "progressData[movieId] = { currentTime, duration, url: globalVideo.url };"
);

fs.writeFileSync('src/App.tsx', code);
