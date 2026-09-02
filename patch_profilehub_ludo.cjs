const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

if (!content.includes('import { LudoGame }')) {
  // Add import
  content = content.replace(/import \{ InstallPWA \} from '\.\/InstallPWA';/, "import { InstallPWA } from './InstallPWA';\nimport { LudoGame } from './LudoGame';");
  
  // Add state
  content = content.replace(/const \[activePopup, setActivePopup\] = useState<string \| null>\(null\);/, "const [activePopup, setActivePopup] = useState<string | null>(null);\n  const [showLudoGame, setShowLudoGame] = useState(false);");
  
  // Add button under App Settings
  const ludoBtn = `
           <button 
             onClick={() => setShowLudoGame(true)}
             className="w-full flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 rounded-lg p-3 font-semibold transition-all mb-4">
             🎯 Play Classic Ludo
           </button>
           
           <button 
             id="cache-btn"`;
             
  content = content.replace(/<button \s*id="cache-btn"/, ludoBtn);
  
  // Add LudoGame render
  content = content.replace(/\{liveUpdate && \(/, "{showLudoGame && <LudoGame onClose={() => setShowLudoGame(false)} />}\n\n      {liveUpdate && (");
  
  fs.writeFileSync('src/components/ProfileHub.tsx', content);
  console.log('ProfileHub patched');
}
