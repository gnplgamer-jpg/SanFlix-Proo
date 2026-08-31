const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/setGlobalVideo\\(\{ url, movie, showLanguageSelector: false, showQualitySelector: false \\}\\)/g, 'setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false })');
code = code.replace(/setGlobalVideo\\(\{ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false \\}\\)/g, 'setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false })');

fs.writeFileSync('src/App.tsx', code);
