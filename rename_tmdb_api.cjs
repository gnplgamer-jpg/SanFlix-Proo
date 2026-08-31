const fs = require('fs');
const files = [
  'server.ts',
  'src/components/AdminPanel.tsx',
  'src/components/PlayerModal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    code = code.replace(/\/api\/tmdb/g, '/api/meta-data');
    fs.writeFileSync(file, code);
  }
});

console.log("Renamed API routes to bypass adblockers");
