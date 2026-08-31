const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "{/* SanFlix-Pro Catt Bot FAB */}",
  "{/* SanFlix-Pro Chat Bot FAB */}"
);

code = code.replace(
  "<ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} availableMovies={moviesList} onSelectMovie={setSelectedMovie} />",
  "<ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} availableMovies={moviesList} onSelectMovie={setSelectedMovie} onOpenShop={() => setActiveTab('shop')} />"
);

fs.writeFileSync('src/App.tsx', code);
