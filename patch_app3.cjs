const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
/onSuccess=\{\(\) => \{\s*setShowAuthModal\(false\);\s*if \(pendingMovie\) \{\s*handleSelectMovie\(pendingMovie\);\s*setPendingMovie\(null\);\s*\}\s*\}\}/g,
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
                }, 100);
                setPendingMovie(null);
              }
            }}`
);

fs.writeFileSync('src/App.tsx', content);
