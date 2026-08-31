const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

// Add import for ReportModal
code = code.replace(
  "import { MovieRail } from './MovieRail';",
  "import { MovieRail } from './MovieRail';\nimport { ReportModal } from './ReportModal';"
);

// Add state for reporting
code = code.replace(
  "const [isReported, setIsReported] = useState(false);",
  "const [reportingData, setReportingData] = useState<{ isOpen: boolean, episodeTitle?: string, episodeIdx?: number, failedUrl: string } | null>(null);"
);

// Replace the main report button logic
const mainReportBtn = `                <button 
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

const newMainReportBtn = `                <button 
                  onClick={() => setReportingData({ isOpen: true, failedUrl: movie.streaming_link_1 || '' })}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 border-red-500/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border overflow-hidden relative transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" /> Report Broken Link
                </button>`;

code = code.replace(mainReportBtn, newMainReportBtn);

// Replace episode report button logic
const epReportBtn = `                          <button
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

const newEpReportBtn = `                          <button
                            onClick={() => setReportingData({ isOpen: true, episodeTitle: ep.title, episodeIdx: idx, failedUrl: ep.url || '' })}
                            title="Report broken link"
                            className="bg-red-900/40 text-red-400 hover:bg-red-800/60 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <AlertCircle className="w-3 h-3" />
                          </button>`;

// Replace all occurrences of epReportBtn
code = code.replaceAll(epReportBtn, newEpReportBtn);

// Add <ReportModal /> component rendering at the end of PlayerModal
const endOfModal = `      </AnimatePresence>
    </div>
  );
}`;

const newEndOfModal = `      </AnimatePresence>
      <ReportModal
        isOpen={!!reportingData?.isOpen}
        onClose={() => setReportingData(null)}
        title={reportingData?.episodeTitle ? \`Report Episode: \${reportingData.episodeTitle}\` : 'Report Broken Link'}
        onSubmit={async (description) => {
          if (!reportingData) return;
          await addDoc(collection(db, 'SanFlix_Reports'), {
            movieId: movie.firebase_id || movie.id,
            movieTitle: movie.title,
            episodeTitle: reportingData.episodeTitle || '',
            episodeIdx: reportingData.episodeIdx ?? null,
            failedUrl: reportingData.failedUrl,
            description,
            timestamp: new Date().toISOString(),
            resolved: false
          });
        }}
      />
    </div>
  );
}`;

code = code.replace(endOfModal, newEndOfModal);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
