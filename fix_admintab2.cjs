const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /const \[adminTab, setAdminTab\] = useState<[^>]+>\('content'\);/;
const replacement = "const [adminTab, setAdminTab] = useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash' | 'requests' | 'update' | 'users' | 'notifications'>('content');";

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Fixed adminTab type in AdminPanel');
