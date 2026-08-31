const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
content = content.replace(
  /import \{ TopHeader \} from '\.\/components\/TopHeader';/,
  "import { TopHeader } from './components/TopHeader';\nimport { GamesHub } from './components/GamesHub';\nimport { LudoGame } from './components/LudoGame';"
);

// Add to switch cases
const gamesCode = `
        ) : activeTab === 'games' ? (
          <GamesHub onSelectGame={(id) => setActiveTab(id)} />
        ) : activeTab === 'ludo' ? (
          <LudoGame onBack={() => setActiveTab('games')} onGameEnd={() => setActiveTab('games')} />
`;

content = content.replace(
  /\) : activeTab === 'explore' \? \(/,
  `) : activeTab === 'games' ? (
          <GamesHub onSelectGame={(id) => setActiveTab(id)} />
        ) : activeTab === 'ludo' ? (
          <LudoGame onBack={() => setActiveTab('games')} onGameEnd={() => setActiveTab('games')} />
        ) : activeTab === 'explore' ? (`
);

content = content.replace(/onGamesClick=\{\(\) => setActiveTab\('games'\)\}/, ''); // in case I already added it
content = content.replace(/onResumeLatest=\{resumeLatestVideo\}/, "onResumeLatest={resumeLatestVideo}\n            onGamesClick={() => setActiveTab('games')}");

fs.writeFileSync('src/App.tsx', content);
