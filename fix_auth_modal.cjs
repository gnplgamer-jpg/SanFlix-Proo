const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetReturn = `      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />`;
const replaceReturn = `      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
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
                handleSelectMovie(pendingMovie);
                setPendingMovie(null);
              }
            }} 
          />
        )}
      </AnimatePresence>`;

code = code.replace(targetReturn, replaceReturn);

// Also let's double check if AuthModal component renders properly.
fs.writeFileSync('src/App.tsx', code);
console.log("Added AuthModal to App.tsx");
