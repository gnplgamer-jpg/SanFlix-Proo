const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "<ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} availableMovies={filteredContent} onSelectMovie={handleSelectMovie} />",
  "<ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} availableMovies={filteredContent} onSelectMovie={handleSelectMovie} onOpenShop={() => setActiveTab('shop')} />"
);

fs.writeFileSync('src/App.tsx', code);
