const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const targetGate2 = `<div className="relative p-8 text-center pb-6 bg-gradient-to-b from-[#E50914]/10 to-transparent">
                  <div className="w-16 h-16 bg-[#E50914]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E50914]/50 shadow-[0_0_20px_rgba(229,9,20,0.5)] animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-[#E50914]" />
                  </div>`;

const newGate2 = `<div className={\`relative p-8 text-center pb-6 bg-gradient-to-b \${toggleTarget === 'phub' ? 'from-orange-500/10' : 'from-[#E50914]/10'} to-transparent\`}>
                  <div className={\`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border animate-pulse \${toggleTarget === 'phub' ? 'bg-orange-500/20 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-[#E50914]/20 border-[#E50914]/50 shadow-[0_0_20px_rgba(229,9,20,0.5)]'}\`}>
                    <AlertTriangle className={\`w-8 h-8 \${toggleTarget === 'phub' ? 'text-orange-500' : 'text-[#E50914]'}\`} />
                  </div>`;

code = code.replace(targetGate2, newGate2);
fs.writeFileSync('src/components/ProfileHub.tsx', code);
