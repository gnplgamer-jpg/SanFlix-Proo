const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `{/* Actresses Rail */}`;
const replacement = `{/* Live TV Trending Rail */}
                  <LiveTvRail onSelectChannel={(channel) => { 
                    localStorage.setItem('pendingLiveChannel', JSON.stringify(channel)); 
                    setActiveTab('live'); 
                  }} />

                  {/* Actresses Rail */}`;

code = code.replace(search, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('patched app to include livetvrail');
