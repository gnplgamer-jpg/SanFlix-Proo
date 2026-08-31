const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetMemo = `  const sanFlixProContent = useMemo(() => {
    return filteredContent.filter(m => m.is_sanflix_pro);
  }, [filteredContent]);`;

const newMemo = `  const sanFlixProContent = useMemo(() => {
    return filteredContent.filter(m => m.is_sanflix_pro);
  }, [filteredContent]);

  const phubContent = useMemo(() => {
    return filteredContent.filter(m => m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub'));
  }, [filteredContent]);`;

code = code.replace(targetMemo, newMemo);

const targetRail = `                  {/* SanFlix-Pro Network Channel */}
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
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              {movie.ad_gate && (
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">18+</div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-red-600 text-white rounded-full p-3 shadow-lg shadow-red-600/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-white font-medium text-sm truncate px-1">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}`;

const newRail = `                  {/* SanFlix-Pro Network Channel */}
                  {sanFlixProContent.length > 0 && (!isPHubEnabled || !isAdultEnabled) && (
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
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              {movie.ad_gate && (
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">18+</div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-red-600 text-white rounded-full p-3 shadow-lg shadow-red-600/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-white font-medium text-sm truncate px-1">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Porn Hub Network Channel */}
                  {phubContent.length > 0 && isPHubEnabled && isAdultEnabled && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-orange-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porn Hub</h2>
                        <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Premium</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {phubContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] border-2 border-orange-500/30 group-hover:border-orange-500 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                              <img
                                src={movie.poster_url || movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute top-2 left-2 bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm z-10 shadow-lg uppercase tracking-wider">18+ VIP</div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-white font-medium text-sm truncate px-1">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}`;

code = code.replace(targetRail, newRail);
fs.writeFileSync('src/App.tsx', code);
