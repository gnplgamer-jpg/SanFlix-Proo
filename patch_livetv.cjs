const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

code = code.replace(
  '<p className="font-bold text-white mb-1">Stream Offline or CORS Blocked</p>',
  '<p className="font-bold text-white mb-1 text-lg">Broadcast Offline</p>'
);

code = code.replace(
  '<p className="text-xs">Try selecting another channel.</p>',
  '<p className="text-sm max-w-[280px] mx-auto text-zinc-500 mb-4">This channel is currently not broadcasting any live events. Please check back later or select another channel.</p>\n              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/5 animate-pulse">\n                <span className="text-xs text-white/70">Next Event: Scheduled soon</span>\n              </div>'
);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('LiveTvScreen patched');
