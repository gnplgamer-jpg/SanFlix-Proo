const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const tabButtonsRegex = /<button onClick=\{\(\) => setAdminTab\('tmdb'\)\} className=\{\`text-sm font-bold pb-1 border-b-2 \$\{adminTab === 'tmdb' \? 'border-red-500 text-white' : 'border-transparent text-zinc-500'\}\`\}>Pending \/ TMDB<\/button>/;

const newTabButtons = `<button onClick={() => setAdminTab('tmdb')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'tmdb' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Pending / TMDB</button>
            <button onClick={() => setAdminTab('users')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'users' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Users</button>
            <button onClick={() => setAdminTab('notifications')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'notifications' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Notifications</button>`;

code = code.replace(tabButtonsRegex, newTabButtons);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Added Users and Notifications tabs to AdminPanel');
