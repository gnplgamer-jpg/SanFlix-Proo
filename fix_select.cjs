const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetEffect = `  useEffect(() => {
    if (selectedMovie && !user) {
      setPendingMovie(selectedMovie);
      setSelectedMovie(null);
      setShowAuthModal(true);
    }
  }, [selectedMovie, user]);`;

code = code.replace(targetEffect, '');

const handleSelectTarget = `const handleSelectMovie = (movie: any) => {
    if (!isSubscribed) {
      setPendingMovieForSubscribe(movie);
      setShowSubscribePopup(true);
      return;
    }
    
    setSelectedMovie(movie);`;

const handleSelectReplace = `const handleSelectMovie = (movie: any) => {
    if (!user) {
      setPendingMovie(movie);
      setShowAuthModal(true);
      return;
    }

    if (!isSubscribed) {
      setPendingMovieForSubscribe(movie);
      setShowSubscribePopup(true);
      return;
    }
    
    setSelectedMovie(movie);`;

code = code.replace(handleSelectTarget, handleSelectReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed handleSelectMovie and removed redundant useEffect");
