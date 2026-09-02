const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Add imports
code = code.replace(/import Hls from 'hls\.js';/, 
  `import Hls from 'hls.js';\nimport { db, collection, addDoc } from '../firebase';`);

// Add Report logic function inside the component
const fnRegex = /const handleScrollRight = \(\) => \{[\s\S]*?\};/;
const fnReplacement = `const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const submitReport = async () => {
    if (!currentChannel) return;
    try {
      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieTitle: \`Live TV: \${currentChannel.name}\`,
        failedUrl: currentChannel.url,
        description: reportText,
        type: 'LiveTV',
        timestamp: new Date().toISOString()
      });
      setShowReportModal(false);
      setReportText('');
      alert("Report sent to Admin. Thank you!");
    } catch(e) {
      console.error(e);
      alert("Error sending report.");
    }
  };`;
code = code.replace(fnRegex, fnReplacement);

// Add Report button
const buttonRegex = /<Settings className="w-5 h-5" \/>\s*<\/button>/;
const buttonReplacement = `<Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowReportModal(true)} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger"
                title="Report / Suggestions"
              >
                <MessageSquare className="w-5 h-5 text-zinc-300" />
              </button>`;
code = code.replace(buttonRegex, buttonReplacement);

// Add Report Modal JSX at the end of overlays
const modalRegex = /\{\/\* Player Overlays \*\/\}/;
const modalReplacement = `{/* Report Modal */}
          {showReportModal && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm">
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Flag className="text-red-500 w-5 h-5"/> Report Issue / Suggestion</h3>
                 <p className="text-sm text-zinc-400 mb-4">Let the admin know if this stream is broken, or give suggestions for new channels!</p>
                 <textarea 
                   value={reportText}
                   onChange={e => setReportText(e.target.value)}
                   placeholder="Describe the issue (e.g., 'Stream keeps buffering', 'Add Zee Tamil')"
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:border-red-500 h-24 mb-4 resize-none"
                 />
                 <div className="flex gap-2 justify-end">
                   <button onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-400 hover:text-white transition">Cancel</button>
                   <button onClick={submitReport} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition shadow-lg">Submit to Admin</button>
                 </div>
               </div>
            </div>
          )}

          {/* Player Overlays */}`;
code = code.replace(modalRegex, modalReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Added Report feature');
