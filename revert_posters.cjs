const fs = require('fs');

const replaceInFile = (file, line, replacement) => {
    let lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines[line - 1] = lines[line - 1].replace(/aspect-video/, replacement);
    fs.writeFileSync(file, lines.join('\n'));
}

replaceInFile('src/components/Movies.tsx', 24, 'aspect-[2/3]');
replaceInFile('src/components/TvShows.tsx', 24, 'aspect-[2/3]');
replaceInFile('src/components/Discover.tsx', 280, 'aspect-[2/3]');
replaceInFile('src/components/Discover.tsx', 336, 'aspect-[2/3]');
replaceInFile('src/components/PhubAPIContent.tsx', 79, 'aspect-[3/4]');
replaceInFile('src/components/TrendingVideos.tsx', 78, 'aspect-[3/4]');
replaceInFile('src/components/AdminPanel.tsx', 486, 'aspect-[2/3]');
replaceInFile('src/components/PlayerModal.tsx', 651, 'aspect-[2/3]');

// App.tsx
replaceInFile('src/App.tsx', 722, 'aspect-[4/3]');
replaceInFile('src/App.tsx', 906, 'aspect-[2/3]');
replaceInFile('src/App.tsx', 1082, 'aspect-[2/3]');
replaceInFile('src/App.tsx', 1153, 'aspect-[4/3]');
replaceInFile('src/App.tsx', 1242, 'aspect-[3/4]');
replaceInFile('src/App.tsx', 1282, 'aspect-[3/4]');
replaceInFile('src/App.tsx', 1320, 'aspect-[3/4]');
replaceInFile('src/App.tsx', 1479, 'aspect-[2/3]');
replaceInFile('src/App.tsx', 1514, 'aspect-[2/3]');

console.log("Posters reverted");
