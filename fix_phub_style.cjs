const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetPhub = `                              <div className="absolute top-2 left-2 bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm z-10 shadow-lg uppercase tracking-wider">18+ VIP</div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-white font-medium text-sm truncate px-1">{movie.title}</h3>`;

const newPhub = `                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 border border-orange-500/30">
                                PREMIUM
                              </div>
                              {movie.rating && movie.rating > 8.5 && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5 z-10">
                                  <TrendingUp className="w-2.5 h-2.5" />
                                  POPULAR
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-1 text-zinc-100">{movie.title}</h3>`;

code = code.replace(targetPhub, newPhub);

fs.writeFileSync('src/App.tsx', code);
