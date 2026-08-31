const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const targetFetch = `availableMovies: availableMovies.map(m => ({ title: m.title, imageUrl: m.poster_url || m.imageUrl, type: m.media_layout_format, id: m.id || m.firebase_id }))`;
const newFetch = `availableMovies: availableMovies.map(m => ({ title: m.title, imageUrl: m.poster_url || m.imageUrl, type: m.media_layout_format, id: m.id || m.firebase_id, qualities: ['720p', '1080p'] }))`;
code = code.replace(targetFetch, newFetch);

fs.writeFileSync('src/components/ChatBot.tsx', code);
