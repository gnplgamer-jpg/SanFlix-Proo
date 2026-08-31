const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/const defaultStaticCategories = \['All', 'Recent', 'Bhojpuri', 'Romantic', 'Horror', 'Action', 'Thriller', 'Sci-Fi', 'Crime', 'Comedy', 'Anime', 'Old is gold', '🔥 18\+ Hub'\];/, 
  "const defaultStaticCategories = ['All', 'SanFlix-Pro', 'Recent', 'Bhojpuri', 'Romantic', 'Horror', 'Action', 'Thriller', 'Sci-Fi', 'Crime', 'Comedy', 'Anime', 'Old is gold', '🔥 18+ Hub'];");

fs.writeFileSync('src/App.tsx', code);
