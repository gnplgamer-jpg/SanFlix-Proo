const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const target = `              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-400 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                </div>
              </div>`;

const replace = `              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-400 flex items-center justify-center p-[2px] cursor-pointer hover:scale-110 transition-transform" onClick={onResumeLatest} title="Resume Last Video">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                </div>
              </div>`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/TopHeader.tsx', code);
