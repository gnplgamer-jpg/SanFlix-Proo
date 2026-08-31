const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const phubDef = `  const phubContent = useMemo(() => {
    return filteredContent.filter(m => m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub'));
  }, [filteredContent]);`;

const newPhubDef = `  const phubLiveContent = useMemo(() => {
    return filteredContent.filter(m => m.is_phub_live);
  }, [filteredContent]);

  const phubContent = useMemo(() => {
    return filteredContent.filter(m => !m.is_phub_live && m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub'));
  }, [filteredContent]);`;

code = code.replace(phubDef, newPhubDef);

const phubRender = `                  {/* Porn Hub Network Channel */}
                  {isPHubEnabled && (
                    <PhubAPIContent onPlayUrl={(url, title) => {
                      setGlobalVideo({
                        url,
                        movie: { title } as any,
                        showLanguageSelector: false,
                        showQualitySelector: false,
                        showEpisodeSelector: false,
                        fallbackUrls: []
                      });
                    }} />
                  )}`;

const newPhubRender = `                  {/* Porn Hub Network Channel */}
                  {phubLiveContent.length > 0 && isPHubEnabled && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-orange-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porn Hub (LIVE)</h2>
                        <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Live</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {phubLiveContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] border-2 border-orange-500/30 group-hover:border-orange-500 transition-all">
                              <img
                                src={movie.poster_url || movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 border border-orange-500/30">
                                LIVE
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-2 text-zinc-100">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}`;

code = code.replace(phubRender, newPhubRender);

// Also remove import for PhubAPIContent
code = code.replace(`import { PhubAPIContent } from './components/PhubAPIContent';\n`, '');

fs.writeFileSync('src/App.tsx', code);
