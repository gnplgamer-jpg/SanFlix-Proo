const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetChat = "<ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} availableMovies={moviesList} />";
const newChat = "<ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} availableMovies={moviesList} onSelectMovie={setSelectedMovie} />";

code = code.replace(targetChat, newChat);
fs.writeFileSync('src/App.tsx', code);
