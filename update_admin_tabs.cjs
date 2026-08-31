const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetButtons = `<button onClick={() => setAdminTab('content')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'content' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Content Injector</button>`;

const replacementButtons = `<button onClick={() => setAdminTab('content')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'content' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Content Injector</button>
            <button onClick={() => setAdminTab('tmdb')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'tmdb' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>TMDB Upcoming/Latest</button>`;

code = code.replace(targetButtons, replacementButtons);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Tab buttons updated");
