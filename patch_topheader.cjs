const fs = require('fs');
let content = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');

// Add Gamepad2 to imports
content = content.replace(
  /import \{ Search(.*?) \} from 'lucide-react';/,
  "import { Search$1, Gamepad2 } from 'lucide-react';"
);

// Add onGamesClick to props
content = content.replace(
  /onCartClick\?: \(\) => void;/,
  "onCartClick?: () => void;\n  onGamesClick?: () => void;"
);

// Add to destructuring
content = content.replace(
  /onCartClick, onResumeLatest, coins = 0/,
  "onCartClick, onResumeLatest, onGamesClick, coins = 0"
);

// Insert Games button before Search button
const searchButtonCode = `<button
            onClick={() => setIsSearchActive(!isSearchActive)}`;

const gamesButtonCode = `
          {!isSearchActive && (
            <button
              onClick={onGamesClick}
              className="w-9 h-9 preserve-color rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
              title="GMS"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchActive(!isSearchActive)}`;

content = content.replace(searchButtonCode, gamesButtonCode);

fs.writeFileSync('src/components/TopHeader.tsx', content);
