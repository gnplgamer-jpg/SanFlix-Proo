const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>`;

const newStr = `        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
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
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/App.tsx', code);
