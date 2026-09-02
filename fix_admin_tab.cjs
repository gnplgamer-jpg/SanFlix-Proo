const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const anchor = "const [adminTab, setAdminTab] = useState<'content' | 'update' | 'shop' | 'tmdb' | 'reports' | 'trash' | 'requests'>('content');";
const newTab = "const [adminTab, setAdminTab] = useState<'content' | 'update' | 'shop' | 'tmdb' | 'reports' | 'trash' | 'requests' | 'users' | 'notifications'>('content');";
code = code.replace(anchor, newTab);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Fixed admin tab type');
