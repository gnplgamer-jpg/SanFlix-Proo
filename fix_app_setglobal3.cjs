const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.split('setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false });').join('setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false });');
code = code.split('setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false })}').join('setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false })}');

fs.writeFileSync('src/App.tsx', code);
