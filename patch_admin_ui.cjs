const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add tab button
code = code.replace(
  /<button onClick=\{\(\) => setAdminTab\('shop'\)\}/,
  `<button onClick={() => setAdminTab('update')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'update' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>App Update</button>
            <button onClick={() => setAdminTab('shop')}`
);

// Add tab content
const updateTabContent = `
        {adminTab === 'update' && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-black text-white mb-6">In-App Update Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">New Version Number (e.g. 1.0.1)</label>
                <input 
                  type="text" 
                  value={appUpdateData.version}
                  onChange={e => setAppUpdateData({...appUpdateData, version: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Leave empty to disable update popup"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">APK Download URL</label>
                <input 
                  type="text" 
                  value={appUpdateData.url}
                  onChange={e => setAppUpdateData({...appUpdateData, url: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="https://example.com/sanflix.apk"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-bold mb-2">What's New (Changelog)</label>
                <textarea 
                  value={appUpdateData.changelog}
                  onChange={e => setAppUpdateData({...appUpdateData, changelog: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-red-500 focus:outline-none h-32"
                  placeholder="- Added new visual enhancer\\n- Bug fixes"
                />
              </div>
              <button 
                onClick={saveAppUpdate}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Save Update Info
              </button>
            </div>
          </div>
        )}
`;

code = code.replace(
  /\{adminTab === 'shop' && \(/,
  updateTabContent + "\n        {adminTab === 'shop' && ("
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('patched admin tab content');
