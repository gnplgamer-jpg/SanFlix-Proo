const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetHeader = `<div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setSelectedCategory(null)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
                          <ChevronLeft className="w-5 h-5 text-zinc-300" />
                        </button>
                        <h2 className="text-xl font-bold tracking-tight text-white m-0 border-l-4 border-red-600 pl-3">
                          {selectedCategory === 'All' ? 'All Content' : selectedCategory.startsWith('Actress: ') ? selectedCategory.replace('Actress: ', '') + ' Movies' : selectedCategory} ({searchResults.length})
                        </h2>
                      </div>`;

const newHeader = `{selectedCategory.startsWith('Actress: ') ? (
                        <div className="mb-8 relative overflow-hidden rounded-2xl p-6 md:p-10 bg-gradient-to-r from-pink-900/40 via-red-900/40 to-yellow-900/40 border border-red-900/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                          <button onClick={() => setSelectedCategory(null)} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-10">
                            <ChevronLeft className="w-6 h-6 text-white" />
                          </button>
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] shrink-0 bg-zinc-900 flex items-center justify-center">
                            <span className="text-4xl font-black text-zinc-700">{selectedCategory.replace('Actress: ', '').charAt(0)}</span>
                          </div>
                          <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                            <span className="text-red-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-1">Spotlight</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">{selectedCategory.replace('Actress: ', '')}</h2>
                            <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed">
                              Explore all exclusive movies and web series featuring {selectedCategory.replace('Actress: ', '')}. Watch her boldest and most captivating performances.
                            </p>
                            <div className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10">
                               <Sparkles className="w-4 h-4 text-pink-400" />
                               {searchResults.length} Titles Available
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-6">
                          <button onClick={() => setSelectedCategory(null)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-zinc-300" />
                          </button>
                          <h2 className="text-xl font-bold tracking-tight text-white m-0 border-l-4 border-red-600 pl-3">
                            {selectedCategory === 'All' ? 'All Content' : selectedCategory} ({searchResults.length})
                          </h2>
                        </div>
                      )}`;
                      
code = code.replace(targetHeader, newHeader);
fs.writeFileSync('src/App.tsx', code);
