const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetFilters = `            <div className="flex gap-2 mb-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">`;

const replacementFilters = `            <div className="flex gap-2 mb-4 justify-between items-center">
              <div className="flex gap-2">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
                  <button 
                    onClick={() => setContentTab('Normal')}
                    className={\`px-3 py-1 text-xs font-semibold rounded-md transition \${contentTab === 'Normal' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}\`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setContentTab('18+')}
                    className={\`px-3 py-1 text-xs font-semibold rounded-md transition \${contentTab === '18+' ? 'bg-red-900/50 text-red-500' : 'text-zinc-400 hover:text-red-400/50'}\`}
                  >
                    18+ Adult
                  </button>
                </div>
              </div>
              <button 
                onClick={runLinkHealthCheck}
                disabled={isCheckingLinks}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                {isCheckingLinks ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {isCheckingLinks ? \`Checking Links (\${checkProgress.current}/\${checkProgress.total})\` : 'Verify Streaming Links'}
              </button>
            </div>
            <div className="hidden">`;

code = code.replace(`            <div className="flex gap-2 mb-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
                <button 
                  onClick={() => setContentTab('Normal')}
                  className={\`px-3 py-1 text-xs font-semibold rounded-md transition \${contentTab === 'Normal' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}\`}
                >
                  Standard
                </button>
                <button 
                  onClick={() => setContentTab('18+')}
                  className={\`px-3 py-1 text-xs font-semibold rounded-md transition \${contentTab === '18+' ? 'bg-red-900/50 text-red-500' : 'text-zinc-400 hover:text-red-400/50'}\`}
                >
                  18+ Adult
                </button>
              </div>
            </div>`, replacementFilters);

const targetCard = `<div key={item.firebase_id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                  <div className="relative aspect-[2/3] bg-zinc-800">
                    <img src={item.poster_url || item.backdrop_url} alt={item.title} className="w-full h-full object-cover" />
                    {selectedItems.includes(item.firebase_id) && (`;

const replacementCard = `<div key={item.firebase_id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                  <div className="relative aspect-[2/3] bg-zinc-800">
                    <img src={item.poster_url || item.backdrop_url} alt={item.title} className="w-full h-full object-cover" />
                    {item.needs_update && (
                      <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-red-500 z-10 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Broken Link
                      </div>
                    )}
                    {selectedItems.includes(item.firebase_id) && (`;

code = code.replace(targetCard, replacementCard);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Added verifier UI");
