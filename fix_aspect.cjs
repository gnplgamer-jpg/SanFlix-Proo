const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/Movies.tsx',
  'src/components/TvShows.tsx',
  'src/components/Discover.tsx',
  'src/components/TrendingVideos.tsx',
  'src/components/PhubAPIContent.tsx',
  'src/components/PlayerModal.tsx',
  'src/components/AdminPanel.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // Replace aspect-[2/3], aspect-[3/4], aspect-[4/3] with aspect-video
    code = code.replace(/aspect-\[2\/3\]/g, 'aspect-video');
    code = code.replace(/aspect-\[3\/4\]/g, 'aspect-video');
    code = code.replace(/aspect-\[4\/3\]/g, 'aspect-video');
    
    fs.writeFileSync(file, code);
  }
});
