const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const targetStr = `                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.suggestions.map((sug, idx) => (
                          <div key={idx} onClick={() => {
                              const found = availableMovies.find(m => m.title.toLowerCase().trim() === sug.title.toLowerCase().trim() || (sug.id && (m.id === sug.id || m.firebase_id === sug.id)));
                              if (found && onSelectMovie) {
                                 onSelectMovie(found);
                                 onClose();
                              } else {
                                 // Alert or just log if not found
                                 console.log("Not in local DB:", sug.title);
                              }
                           }} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-[180px] group cursor-pointer hover:border-red-500/50 transition-colors">
                            {sug.imageUrl && (
                               <div className="w-full h-[100px] relative overflow-hidden bg-black">
                                  <img src={sug.imageUrl} alt={sug.title} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450/18181b/ef4444?text=No+Poster' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                               </div>
                            )}
                            <div className="p-2 flex flex-col gap-1">
                               <p className="text-white text-xs font-bold truncate" title={sug.title}>{sug.title}</p>
                               {sug.qualities && sug.qualities.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {sug.qualities.map(q => (
                                       <span key={q} className="bg-zinc-800 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5">
                                          <Download className="w-2.5 h-2.5" /> {q}
                                       </span>
                                    ))}
                                  </div>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>`;

const newStr = `                      <div className="flex flex-wrap gap-3 mt-3">
                        {msg.suggestions.map((sug, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            key={idx} 
                            onClick={() => {
                              const found = availableMovies.find(m => m.title.toLowerCase().trim() === sug.title.toLowerCase().trim() || (sug.id && (m.id === sug.id || m.firebase_id === sug.id)));
                              if (found && onSelectMovie) {
                                 onSelectMovie(found);
                                 onClose();
                              } else {
                                 console.log("Not in local DB:", sug.title);
                              }
                           }} 
                           className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden w-[160px] sm:w-[180px] group cursor-pointer hover:border-red-500 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                          >
                            {sug.imageUrl && (
                               <div className="w-full h-[120px] relative overflow-hidden bg-black">
                                  <img 
                                    src={sug.imageUrl} 
                                    alt={sug.title} 
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450/18181b/ef4444?text=No+Poster' }} 
                                    className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-500" 
                                    loading="lazy" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                                     <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                     </div>
                                  </div>
                               </div>
                            )}
                            <div className="p-3 flex flex-col gap-1.5 relative z-10 bg-zinc-900">
                               <p className="text-white text-sm font-bold truncate group-hover:text-red-400 transition-colors" title={sug.title}>{sug.title}</p>
                               {sug.qualities && sug.qualities.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {sug.qualities.map(q => (
                                       <span key={q} className="bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 group-hover:border-red-500/30 transition-colors">
                                          <Download className="w-3 h-3 text-red-500" /> {q}
                                       </span>
                                    ))}
                                  </div>
                               )}
                            </div>
                            
                            {/* Animated highlight border */}
                            <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 group-hover:animate-pulse pointer-events-none" />
                          </motion.div>
                        ))}
                      </div>`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/ChatBot.tsx', code);
