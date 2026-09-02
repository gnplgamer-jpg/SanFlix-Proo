const fs = require('fs');

// 1. Fix Discover.tsx
let discover = fs.readFileSync('src/components/Discover.tsx', 'utf8');
discover = discover.replace(
  /export function Discover\(\{ content = \[\], onSelectMovie \}: \{ content\?: any\[\], onSelectMovie\?: \(movie: any\) => void \}\) \{/,
  'export function Discover({ content = [], onSelectMovie, unlockedContent = {} }: { content?: any[], onSelectMovie?: (movie: any) => void, unlockedContent?: Record<string, number> }) {'
);
fs.writeFileSync('src/components/Discover.tsx', discover);

// 2. Fix DirectVideoPlayer.tsx
let player = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');
player = player.replace(/screen\.orientation\.lock/g, '(screen.orientation as any).lock');
fs.writeFileSync('src/components/DirectVideoPlayer.tsx', player);

// 3. Fix Movies.tsx & TvShows.tsx
let movies = fs.readFileSync('src/components/Movies.tsx', 'utf8');
if (!movies.includes('import React')) {
    movies = "import React from 'react';\n" + movies;
    fs.writeFileSync('src/components/Movies.tsx', movies);
}

let tvshows = fs.readFileSync('src/components/TvShows.tsx', 'utf8');
if (!tvshows.includes('import React')) {
    tvshows = "import React from 'react';\n" + tvshows;
    fs.writeFileSync('src/components/TvShows.tsx', tvshows);
}

console.log('Fixed TypeScript errors');
