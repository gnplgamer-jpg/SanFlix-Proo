const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const targetEpisodeButtons = `                          {ep.download_url ? (
                            <button
                              onClick={() => handleActionClick(ep.download_url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> Get
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex-1 bg-zinc-800/50 text-zinc-600 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold cursor-not-allowed"
                            >
                              <Download className="w-3 h-3" /> N/A
                            </button>
                          )}`;

const replacementEpisodeButtons = `                          {ep.download_url ? (
                            <button
                              onClick={() => handleActionClick(ep.download_url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> Get
                            </button>
                          ) : (
                            <button
                              onClick={() => setReportingData({ isOpen: true, failedUrl: ep.url, episodeTitle: ep.title, episodeIdx: idx })}
                              className="flex-1 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-colors"
                              title="Report Issue"
                            >
                              <AlertCircle className="w-3 h-3" /> Report
                            </button>
                          )}`;

code = code.replace(targetEpisodeButtons, replacementEpisodeButtons);
fs.writeFileSync('src/components/PlayerModal.tsx', code);
console.log("Updated episode buttons in PlayerModal");
