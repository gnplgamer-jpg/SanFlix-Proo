const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
/setTimeout\(\(\) => \{[\s\S]*?\}, 100\);/m,
`setTimeout(() => {
  setSelectedMovie(pendingMovie);
  
  const movieId = pendingMovie.id || pendingMovie.firebase_id;
  if (continueWatchingIds.includes(movieId)) {
    showToast('Continuing where you left off');
  }

  const newCW = [movieId, ...continueWatchingIds.filter(id => id !== movieId)].slice(0, 15);
  setContinueWatchingIds(newCW);
  localStorage.setItem('SANFLIX_CW', JSON.stringify(newCW));
}, 100);`
);

fs.writeFileSync('src/App.tsx', content);
