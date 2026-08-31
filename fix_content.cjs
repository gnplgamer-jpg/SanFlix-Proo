const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add SanFlixProContent
const insertPro = `
  const sanFlixProContent = useMemo(() => {
    return moviesList.filter(m => m.ad_gate).slice(0, 10);
  }, [moviesList]);
`;

code = code.replace(/  const oldIsGoldMovies = useMemo/, insertPro + '\n  const oldIsGoldMovies = useMemo');

// Replace the network category list injection for SanFlix-Pro
const insertRail = `
                  {/* SanFlix-Pro Network Channel */}
                  {sanFlixProContent.length > 0 && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-red-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">SanFlix-Pro</h2>
                        <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Premium</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {sanFlixProContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-lg shadow-black/50 border-2 border-red-500/20 group-hover:border-red-500 transition-colors">
                              <img
                                src={movie.poster_url || movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-red-500 border border-red-500/30">
                                4K ULTRA
                              </div>
                              <button 
                                onClick={(e) => toggleMyList(e, movie)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full border border-white/10 text-white hover:text-red-500"
                              >
                                <Heart className={\`w-3 h-3 \${myListIds.includes(movie.id || movie.firebase_id) ? 'fill-red-500 text-red-500' : ''}\`} />
                              </button>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-1 text-zinc-100">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Popular Network Channels */}`;

code = code.replace(/                  \{\/\* Popular Network Channels \*\/\}/, insertRail);

// Finally, render the SubscribeModal in the return of App
code = code.replace(/      <\/div>\n\n      <AnimatePresence>\n        \{toastMessage/, `      </div>\n\n      <AnimatePresence>\n        {showSubscribePopup && (\n          <SubscribeModal\n            onSubscribe={() => {\n              setIsSubscribed(true);\n              setShowSubscribePopup(false);\n              localStorage.setItem('SANFLIX_PRO_SUBSCRIBED', 'true');\n              if (pendingMovieForSubscribe) {\n                setTimeout(() => {\n                  setSelectedMovie(pendingMovieForSubscribe);\n                  setPendingMovieForSubscribe(null);\n                }, 300);\n              }\n            }}\n            onClose={() => {\n              setShowSubscribePopup(false);\n              setPendingMovieForSubscribe(null);\n            }}\n          />\n        )}\n      </AnimatePresence>\n\n      <AnimatePresence>\n        {toastMessage`);

fs.writeFileSync('src/App.tsx', code);
