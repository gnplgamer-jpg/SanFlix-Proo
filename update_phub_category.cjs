const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStyle = `                      const isPro = catName === 'SanFlix-Pro';
                      
                      return (
                        <button
                          key={catName}
                          onClick={() => setSelectedCategory(isActive ? null : catName)}
                          className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-colors \${
                            isActive 
                              ? (isPro ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-600 text-white border-red-500')
                              : isPro
                                ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                : 'border-zinc-800 text-zinc-300 bg-zinc-900/50 hover:border-zinc-600 hover:text-white'
                          }\`}
                        >
                          {catName}
                        </button>
                      );`;

const newStyle = `                      const isPro = catName === 'SanFlix-Pro';
                      const isPHub = catName === 'Porn Hub';
                      
                      return (
                        <button
                          key={catName}
                          onClick={() => setSelectedCategory(isActive ? null : catName)}
                          className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-colors \${
                            isActive 
                              ? (isPro ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : isPHub ? 'bg-orange-500 text-black border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)] font-bold' : 'bg-red-600 text-white border-red-500')
                              : isPro
                                ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                : isPHub
                                  ? 'border-orange-500/50 text-orange-500 bg-orange-500/10 hover:bg-orange-500/20'
                                  : 'border-zinc-800 text-zinc-300 bg-zinc-900/50 hover:border-zinc-600 hover:text-white'
                          }\`}
                        >
                          {isPHub ? (
                             <span className="flex items-center gap-1 font-bold"><span className="text-white">Porn</span><span className="bg-orange-500 text-black px-1 rounded-sm leading-tight">Hub</span></span>
                          ) : (
                             catName
                          )}
                        </button>
                      );`;

code = code.replace(targetStyle, newStyle);
fs.writeFileSync('src/App.tsx', code);
