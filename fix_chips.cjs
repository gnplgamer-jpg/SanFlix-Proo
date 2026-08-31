const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/                      const is18 = catName === '🔥 18\+ Hub';\n                      \n                      return \(\n                        <button\n                          key=\{catName\}\n                          onClick=\{\(\) => setSelectedCategory\(isActive \? null : catName\)\}\n                          className=\{`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-colors \$\{\n                            isActive \n                              \? 'bg-red-600 text-white border-red-500' \n                              : is18 \n                                \? 'border-pink-500\/30 text-pink-400 bg-pink-500\/5 hover:bg-pink-500\/10'\n                                : 'border-zinc-800 bg-zinc-900\/50 text-zinc-300 hover:bg-zinc-800'\n                          \}`\}\n                        >\n                          \{catName\}\n                        <\/button>\n                      \);/, 
  `                      const is18 = catName === '🔥 18+ Hub';
                      const isPro = catName === 'SanFlix-Pro';
                      
                      return (
                        <button
                          key={catName}
                          onClick={() => setSelectedCategory(isActive ? null : catName)}
                          className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-colors \${
                            isActive 
                              ? (isPro ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-600 text-white border-red-500')
                              : isPro
                                ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                : is18 
                                  ? 'border-pink-500/30 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10'
                                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800'
                          }\`}
                        >
                          {catName}
                        </button>
                      );`);

fs.writeFileSync('src/App.tsx', code);
