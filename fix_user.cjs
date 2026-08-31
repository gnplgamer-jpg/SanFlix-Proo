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

const stateTarget = `  const [user, setUser] = useState<any>(null);`;
const stateReplace = `  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (selectedMovie && !user) {
      setPendingMovie(selectedMovie);
      setSelectedMovie(null);
      setShowAuthModal(true);
    }
  }, [selectedMovie, user]);`;

code = code.replace(stateTarget, stateReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed user initialization order");
