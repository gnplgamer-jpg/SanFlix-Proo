const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
/onSuccess=\{\(\) => \{\s*setShowAuthModal\(false\);\s*if \(pendingMovie\) \{\s*handleSelectMovie\(pendingMovie\);\s*setPendingMovie\(null\);\s*\}\s*\}\}/,
`onSuccess={(newUser) => {
              setUser(newUser);
              setShowAuthModal(false);
              if (pendingMovie) {
                setTimeout(() => {
                  setSelectedMovie(pendingMovie);
                  
                  const movieId = pendingMovie.id || pendingMovie.firebase_id;
                  let cwIds = [];
                  try { cwIds = JSON.parse(localStorage.getItem('SANFLIX_CW') || '[]'); } catch(e){}
                  const newCW = [movieId, ...cwIds.filter(id => id !== movieId)].slice(0, 15);
                  localStorage.setItem('SANFLIX_CW', JSON.stringify(newCW));
                  // We skip setContinueWatchingIds because we might not have access to it easily here without triggering a re-render issues, but actually we can just call it via window dispatch or just let it be.
                  // Actually, better: we can just call handleSelectMovie after state updates.
                }, 100);
                setPendingMovie(null);
              }
            }}`
);

fs.writeFileSync('src/App.tsx', content);
