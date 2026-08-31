const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const targetStr = `              {hasContinueWatching && (
                <button 
                  onClick={onResumeLatest}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 hover:scale-105 transition-transform"
                  title="Resume Playing"
                >
                  <PlayCircle className="w-5 h-5 fill-red-500/20" />
                </button>
              )}`;

code = code.replace(targetStr, '');
fs.writeFileSync('src/components/TopHeader.tsx', code);
