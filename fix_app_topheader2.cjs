const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                  const latestMovie = filteredContent.find(m => m.firebase_id === continueWatchingIds[0]) || allContent.find(m => m.firebase_id === continueWatchingIds[0]);`;
const newStr = `                  const latestMovie = filteredContent.find(m => m.firebase_id === continueWatchingIds[0]) || moviesList.find(m => m.firebase_id === continueWatchingIds[0]);`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
