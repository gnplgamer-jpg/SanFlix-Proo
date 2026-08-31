const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add ChatBot import
const importActress = "import { ActressRail } from './components/ActressRail';";
const importChatBot = "import { ChatBot } from './components/ChatBot';";
code = code.replace(importActress, importActress + "\\n" + importChatBot);

// 2. Add lucide icon 'Bot'
code = code.replace("Settings, X, Sparkles } from 'lucide-react'", "Settings, X, Sparkles, Bot } from 'lucide-react'");

// 3. Add state for chat open
const targetState = "const [isLightMode, setIsLightMode] = useState(false);";
const chatState = "const [isLightMode, setIsLightMode] = useState(false);\n  const [isChatOpen, setIsChatOpen] = useState(false);";
code = code.replace(targetState, chatState);

// 4. Add FAB and ChatBot component
const targetBottom = "        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />\\n      </div>\\n    </div>\\n  );\\n}";
const newBottom = `        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* SanFlix-Pro Catt Bot FAB */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-rose-500 shadow-lg shadow-red-900/50 flex items-center justify-center text-white border-2 border-red-400/50 relative overflow-hidden"
        >
          <Bot className="w-7 h-7" />
          <Sparkles className="w-3 h-3 text-yellow-300 absolute top-3 right-3 animate-pulse" />
        </motion.button>
      </div>
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}`;
code = code.replace(/        <BottomNav activeTab=\{activeTab\} onTabChange=\{setActiveTab\} \/>\s+<\/div>\s+<\/div>\s+\);\s+\}/, newBottom);

fs.writeFileSync('src/App.tsx', code);
