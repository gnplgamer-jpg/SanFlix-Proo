const fs = require('fs');

// 1. Remove Gamepad icon from TopHeader
let headerCode = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');
headerCode = headerCode.replace(/\{\!isSearchActive && \(\s*<button\s*onClick=\{onGamesClick\}[\s\S]*?<\/button>\s*\)\}/, '');
fs.writeFileSync('src/components/TopHeader.tsx', headerCode);

// 2. Fix App.tsx to use LiveTvScreen
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("import { LiveTvScreen }")) {
  appCode = appCode.replace("import { TrendingVideos } from './components/TrendingVideos';", "import { TrendingVideos } from './components/TrendingVideos';\nimport { LiveTvScreen } from './components/LiveTvScreen';");
}

const oldTrendingRegex = /\) : activeTab === 'trending' \? \([\s\S]*?<TrendingVideos[\s\S]*?\/>\s*\) : activeTab === 'admin'/;
appCode = appCode.replace(oldTrendingRegex, `) : activeTab === 'trending' ? (\n          <LiveTvScreen />\n        ) : activeTab === 'admin'`);
fs.writeFileSync('src/App.tsx', appCode);

console.log('Fixed');
