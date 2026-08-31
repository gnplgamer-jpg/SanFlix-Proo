const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
const replace = `
  const handleSelectMovie = (movie: any) => {
    if (!isSubscribed) {
      setPendingMovieForSubscribe(movie);
      setShowSubscribePopup(true);
      return;
    }
    setSelectedMovie(movie);
    
    const movieId = movie.id || movie.firebase_id;
    if (continueWatchingIds.includes(movieId)) {
      showToast('Continuing where you left off');
    }

    // Add to continue watching
    const newCW = [movieId, ...continueWatchingIds.filter(id => id !== movieId)].slice(0, 15);
    setContinueWatchingIds(newCW);
    localStorage.setItem('SANFLIX_CW', JSON.stringify(newCW));
  };`;

code = code.replace(/  const handleSelectMovie = \(movie: any\) => {[\s\S]*?localStorage\.setItem\('SANFLIX_CW', JSON\.stringify\(newCW\)\);\n  };/, replace.trim());
fs.writeFileSync('src/App.tsx', code);
