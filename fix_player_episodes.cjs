const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const targetEpisodes = `                        <div className="flex gap-2 w-full mt-auto">
                          <button
                            onClick={() => handleActionClick(ep.url)}
                            className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <Play className="w-3 h-3" /> Play
                          </button>
                          {ep.download_url ? (
                            <button
                              onClick={() => handleActionClick(ep.download_url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> DL
                            </button>
                          ) : null}
                        </div>`;

const replaceEpisodes = `                        <div className="flex gap-2 w-full mt-auto">
                          <button
                            onClick={() => handleActionClick(ep.url)}
                            className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <Play className="w-3 h-3" /> Play
                          </button>
                          {ep.download_url ? (
                            <button
                              onClick={() => handleActionClick(ep.download_url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> DL
                            </button>
                          ) : null}
                          <button
                            onClick={async () => {
                               try {
                                  await addDoc(collection(db, 'SanFlix_Reports'), {
                                    movieId: movie.firebase_id || movie.id,
                                    movieTitle: movie.title,
                                    episodeTitle: ep.title,
                                    episodeIdx: idx,
                                    failedUrl: ep.url || '',
                                    timestamp: new Date().toISOString(),
                                    resolved: false
                                  });
                                  alert('Broken episode reported to admin.');
                               } catch(err) {
                                  alert('Failed to report.');
                               }
                            }}
                            title="Report broken link"
                            className="bg-red-900/40 text-red-400 hover:bg-red-800/60 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <AlertCircle className="w-3 h-3" />
                          </button>
                        </div>`;

code = code.replace(targetEpisodes, replaceEpisodes);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
