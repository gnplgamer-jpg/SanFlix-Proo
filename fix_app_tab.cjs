const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `        ) : activeTab === 'admin' && isAdminUnlocked ? (
          <AdminPanel />
        ) : (`;

const replace = `        ) : activeTab === 'trending' ? (
          <TrendingVideos />
        ) : activeTab === 'admin' && isAdminUnlocked ? (
          <AdminPanel />
        ) : (`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
