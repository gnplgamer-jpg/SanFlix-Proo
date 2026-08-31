const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

// We need to add a state for reported
code = code.replace(
  "export function PlayerModal({ movie, onClose, allContent, onSelectMovie, onPlayVideo }: PlayerModalProps) {",
  "export function PlayerModal({ movie, onClose, allContent, onSelectMovie, onPlayVideo }: PlayerModalProps) {\n  const [isReported, setIsReported] = useState(false);"
);

// Replace the button onClick to avoid alert
const targetButton = `                <button 
                  onClick={async () => {
                     try {
                        await addDoc(collection(db, 'SanFlix_Reports'), {
                          movieId: movie.firebase_id || movie.id,
                          movieTitle: movie.title,
                          episodeTitle: '',
                          failedUrl: movie.streaming_link_1 || '',
                          timestamp: new Date().toISOString(),
                          resolved: false
                        });
                        alert('Broken link reported to admin. We will fix it shortly!');
                     } catch(err) {
                        alert('Failed to report.');
                     }
                  }}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-red-500/30 overflow-hidden relative"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" /> Report Broken Link
                </button>`;

const replaceButton = `                <button 
                  onClick={async () => {
                     if (isReported) return;
                     try {
                        await addDoc(collection(db, 'SanFlix_Reports'), {
                          movieId: movie.firebase_id || movie.id,
                          movieTitle: movie.title,
                          episodeTitle: '',
                          failedUrl: movie.streaming_link_1 || '',
                          timestamp: new Date().toISOString(),
                          resolved: false
                        });
                        setIsReported(true);
                        setTimeout(() => setIsReported(false), 3000);
                     } catch(err) {
                        console.error('Failed to report.', err);
                     }
                  }}
                  className={\`w-full sm:w-auto \${isReported ? 'bg-green-600/20 border-green-500/30' : 'bg-zinc-800 hover:bg-zinc-700 border-red-500/30'} text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border overflow-hidden relative transition-colors\`}
                >
                  {isReported ? (
                    <><CheckCircle className="w-5 h-5 text-green-500" /> Reported!</>
                  ) : (
                    <><AlertCircle className="w-5 h-5 text-red-500" /> Report Broken Link</>
                  )}
                </button>`;

code = code.replace(targetButton, replaceButton);

// We need to add CheckCircle to lucide-react import
code = code.replace(
  "import { Play, Download, ExternalLink, X, Lock, Zap, Youtube, Star, ShieldAlert, MonitorPlay, Smartphone, Globe, Settings, ArrowLeft, Calendar, Share2, AlertCircle } from 'lucide-react';",
  "import { Play, Download, ExternalLink, X, Lock, Zap, Youtube, Star, ShieldAlert, MonitorPlay, Smartphone, Globe, Settings, ArrowLeft, Calendar, Share2, AlertCircle, CheckCircle } from 'lucide-react';"
);

// We also need to fix episodes report button in PlayerModal
const targetEpisodesReport = `                          <button
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
                          </button>`;

const replaceEpisodesReport = `                          <button
                            onClick={async (e) => {
                               const btn = e.currentTarget;
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
                                  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>';
                                  btn.classList.replace('text-red-400', 'text-green-400');
                                  setTimeout(() => {
                                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16.01"/></svg>';
                                    btn.classList.replace('text-green-400', 'text-red-400');
                                  }, 3000);
                               } catch(err) {
                                  console.error('Failed to report.', err);
                               }
                            }}
                            title="Report broken link"
                            className="bg-red-900/40 text-red-400 hover:bg-red-800/60 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <AlertCircle className="w-3 h-3" />
                          </button>`;

code = code.replace(targetEpisodesReport, replaceEpisodesReport);
fs.writeFileSync('src/components/PlayerModal.tsx', code);

// Same for App.tsx where alert is used in reportBrokenLink
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const targetAppReport = `      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieId,
        movieTitle,
        episodeTitle: episodeTitle || '',
        episodeIdx: episodeIdx ?? null,
        failedUrl,
        timestamp: new Date().toISOString(),
        resolved: false
      });
      alert('Broken link reported to admin successfully.');
    } catch (err) {
      console.error('Failed to report', err);
    }
  };`;

const replaceAppReport = `      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieId,
        movieTitle,
        episodeTitle: episodeTitle || '',
        episodeIdx: episodeIdx ?? null,
        failedUrl,
        timestamp: new Date().toISOString(),
        resolved: false
      });
      // Instead of alert which is blocked in iframe, we can dispatch a custom event or just console log
      console.log('Broken link reported to admin successfully.');
    } catch (err) {
      console.error('Failed to report', err);
    }
  };`;
appCode = appCode.replace(targetAppReport, replaceAppReport);
fs.writeFileSync('src/App.tsx', appCode);

// Same for AdminPanel.tsx where alert is used in resolve
let adminCode = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
adminCode = adminCode.replace(/alert\('Failed to update'\);/g, "console.error('Failed to update');");
fs.writeFileSync('src/components/AdminPanel.tsx', adminCode);

