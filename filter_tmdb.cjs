const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStr = `{trendingTMDB.map(item => (`;
const replaceStr = `{trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).map(item => (`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Filtered TMDB list");
