const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const targetButtons = `<button onClick={confirmToggle} className="flex-1 py-3 bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/50 font-bold hover:bg-[#E50914] hover:text-white transition rounded-xl text-[13px] shadow-[0_0_15px_rgba(229,9,20,0.3)]">Agree & Continue</button>`;

const newButtons = `<button onClick={confirmToggle} className={\`flex-1 py-3 font-bold transition rounded-xl text-[13px] \${toggleTarget === 'phub' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500 hover:text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/50 hover:bg-[#E50914] hover:text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'}\`}>Agree & Continue</button>`;

code = code.replace(targetButtons, newButtons);

const targetContainer = `<motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm relative z-10 rounded-3xl p-[1px] bg-gradient-to-br from-[#E50914]/80 via-zinc-800 to-[#E50914]/10 shadow-[0_0_40px_rgba(229,9,20,0.2)]"
            >`;
const newContainer = `<motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={\`w-full max-w-sm relative z-10 rounded-3xl p-[1px] bg-gradient-to-br \${toggleTarget === 'phub' ? 'from-orange-500/80 via-zinc-800 to-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,0.2)]' : 'from-[#E50914]/80 via-zinc-800 to-[#E50914]/10 shadow-[0_0_40px_rgba(229,9,20,0.2)]'}\`}
            >`;
code = code.replace(targetContainer, newContainer);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
