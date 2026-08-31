const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetButton = `                 {onReport && (
                    <button 
                      onClick={(e) => { 
                         e.stopPropagation(); 
                         if (!isLocked && !isReported) { 
                           onReport(); 
                           setIsReported(true);
                           setTimeout(() => setIsReported(false), 3000);
                         } 
                      }}
                      className={\`\${isReported ? 'bg-green-500/20 border-green-500/50' : 'bg-white/10 hover:bg-white/20 border-white/10'} text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border flex items-center gap-2 px-3\`}
                    >
                      {isReported ? (
                        <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-xs font-bold hidden sm:inline">Reported</span></>
                      ) : (
                        <><AlertCircle className="w-4 h-4 text-red-400" /><span className="text-xs font-bold hidden sm:inline">Report Error</span></>
                      )}
                    </button>
                 )}`;

const replaceButton = `                 {onReport && (
                    <button 
                      onClick={(e) => { 
                         e.stopPropagation(); 
                         if (!isLocked) { 
                           onReport(); 
                         } 
                      }}
                      className="bg-white/10 hover:bg-white/20 border-white/10 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border flex items-center gap-2 px-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold hidden sm:inline">Report Error</span>
                    </button>
                 )}`;

code = code.replace(targetButton, replaceButton);
fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
