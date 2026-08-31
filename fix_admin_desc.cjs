const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetRep = `<p className="font-bold text-white text-lg">{rep.movieTitle} {rep.episodeTitle ? \` - \${rep.episodeTitle}\` : ''}</p>
                    <p className="text-xs text-zinc-400 mt-1">Failed URL: <span className="text-zinc-500 break-all">{rep.failedUrl}</span></p>`;

const replaceRep = `<p className="font-bold text-white text-lg">{rep.movieTitle} {rep.episodeTitle ? \` - \${rep.episodeTitle}\` : ''}</p>
                    <p className="text-xs text-zinc-400 mt-1">Failed URL: <span className="text-zinc-500 break-all">{rep.failedUrl}</span></p>
                    {rep.description && <div className="mt-2 bg-zinc-950 p-2 rounded text-sm text-zinc-300 border border-zinc-800"><span className="text-zinc-500 font-bold block mb-1">User Comment:</span>{rep.description}</div>}`;

code = code.replace(targetRep, replaceRep);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
