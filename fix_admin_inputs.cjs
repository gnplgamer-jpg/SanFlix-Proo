const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStreamLinks = `              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Global Streaming Link (For standalone movies) *</label>
                <input type="text" name="streaming_link_1" value={formData.streaming_link_1} onChange={handleInputChange} placeholder="SERVER 1: Primary Stream URL (Any Direct Network Link)" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              </div>`;

const replaceStreamLinks = `              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Global Streaming Link (For standalone movies) *</label>
                <input type="text" name="streaming_link_1" value={formData.streaming_link_1} onChange={handleInputChange} placeholder="SERVER 1: Primary Stream URL (Any Direct Network Link)" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 2 (Backup)</label>
                   <input type="text" name="streaming_link_2" value={formData.streaming_link_2} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 3 (Backup)</label>
                   <input type="text" name="streaming_link_3" value={formData.streaming_link_3} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 4 (Backup)</label>
                   <input type="text" name="streaming_link_4" value={formData.streaming_link_4} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
              </div>`;

code = code.replace(targetStreamLinks, replaceStreamLinks);

const targetEpisodes = `                    <input
                      type="text"
                      value={ep.url}
                      onChange={(e) => {
                         const newEps = [...formData.episodes];
                         newEps[idx].url = e.target.value;
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      placeholder="Direct Streaming URL"
                      className="flex-1 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                         const newEps = formData.episodes.filter((_, i) => i !== idx);
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 rounded-lg border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>`;

const replaceEpisodes = `                    <input
                      type="text"
                      value={ep.url}
                      onChange={(e) => {
                         const newEps = [...formData.episodes];
                         newEps[idx].url = e.target.value;
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      placeholder="Direct Streaming URL (Server 1)"
                      className="flex-1 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                         const newEps = formData.episodes.filter((_, i) => i !== idx);
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 rounded-lg border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={ep.url_2 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_2=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 2 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                    <input type="text" value={ep.url_3 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_3=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 3 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                    <input type="text" value={ep.url_4 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_4=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 4 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                  </div>`;

code = code.replace(targetEpisodes, replaceEpisodes);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
