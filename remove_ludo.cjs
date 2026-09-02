const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

// Remove import
content = content.replace("import { LudoGame } from './LudoGame';\n", "");
content = content.replace("import { LudoGame } from './LudoGame';", "");

// Remove state
content = content.replace("const [showLudoGame, setShowLudoGame] = useState(false);\n", "");

// Remove button
content = content.replace(/<button \s*onClick=\{\(\) => setShowLudoGame\(true\)\}\s*className="w-full flex items-center justify-center gap-2 bg-blue-500\/10 border border-blue-500\/30 hover:bg-blue-500\/20 text-blue-400 rounded-lg p-3 font-semibold transition-all mb-4">\s*🎯 Play Classic Ludo\s*<\/button>\s*/, "");

// Remove component rendering
content = content.replace(/\{showLudoGame && <LudoGame onClose=\{\(\) => setShowLudoGame\(false\)\} \/>\}\n\n/, "");
content = content.replace("{showLudoGame && <LudoGame onClose={() => setShowLudoGame(false)} />}", "");

fs.writeFileSync('src/components/ProfileHub.tsx', content);
console.log('Ludo removed');
