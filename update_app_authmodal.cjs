const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importTarget = `import { RequestModal } from './components/RequestModal';`;
const importReplace = `import { RequestModal } from './components/RequestModal';\nimport { AuthModal } from './components/AuthModal';`;
code = code.replace(importTarget, importReplace);

const stateTarget = `  const [isRequestOpen, setIsRequestOpen] = useState(false);`;
const stateReplace = `  const [isRequestOpen, setIsRequestOpen] = useState(false);\n  const [showAuthModal, setShowAuthModal] = useState(false);\n  const [pendingMovie, setPendingMovie] = useState<any | null>(null);`;
code = code.replace(stateTarget, stateReplace);

const effectTarget = `  useEffect(() => {
    const fetchPromo = async () => {`;
const effectReplace = `  useEffect(() => {
    if (selectedMovie && !user) {
      setPendingMovie(selectedMovie);
      setSelectedMovie(null);
      setShowAuthModal(true);
    }
  }, [selectedMovie, user]);

  useEffect(() => {
    const fetchPromo = async () => {`;
code = code.replace(effectTarget, effectReplace);

const modalTarget = `      {selectedMovie && (
        <PlayerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}`;
const modalReplace = `      {selectedMovie && user && (
        <PlayerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => {
              setShowAuthModal(false);
              setPendingMovie(null);
            }}
            onSuccess={() => {
              setShowAuthModal(false);
              if (pendingMovie) {
                setSelectedMovie(pendingMovie);
                setPendingMovie(null);
              }
            }}
          />
        )}
      </AnimatePresence>`;
code = code.replace(modalTarget, modalReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with AuthModal logic");
