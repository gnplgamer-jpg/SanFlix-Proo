const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStr = `{adminTab === 'trash' ? (`;

const replaceStr = `{adminTab === 'tmdb' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">Latest / Trending TMDB</h2>
             <button onClick={() => {
                setTrendingLoading(true);
                fetch('/api/meta-data/trending-tmdb')
                  .then(res => res.json())
                  .then(data => { if(data.results) setTrendingTMDB(data.results); setTrendingLoading(false); })
                  .catch(() => setTrendingLoading(false));
             }} className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Refresh</button>
          </div>
          {trendingLoading ? (
             <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingTMDB.map(item => (
                   <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                     <div className="relative aspect-[2/3] bg-zinc-800">
                        <img src={item.poster_path ? \`https://image.tmdb.org/t/p/w500\${item.poster_path}\` : ''} alt={item.title || item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                           <span className="text-sm font-bold">{item.title || item.name}</span>
                           <span className="text-xs text-zinc-400">{item.media_type} | {item.release_date || item.first_air_date}</span>
                           <button onClick={() => {
                              setFormData({ ...initialForm, tmdb_id: item.id.toString(), title: item.title || item.name || '', release_date: item.release_date || item.first_air_date || '' });
                              setTmdbQuery(item.id.toString());
                              setAdminTab('content');
                              window.scrollTo(0, 0);
                           }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg w-full mt-2">
                             Add as Upcoming / Release
                           </button>
                        </div>
                     </div>
                   </div>
                ))}
             </div>
          )}
        </div>
      ) : adminTab === 'trash' ? (`

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("TMDB rendering added");
