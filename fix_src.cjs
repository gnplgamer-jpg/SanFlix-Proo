const fs = require('fs');

const fixFile = (file) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace src={channel.logo}
  code = code.replace(/src=\{channel\.logo\}/g, "src={channel.logo || `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String(channel.name || 'TV').substring(0,3))}`}");
  
  // AdminPanel.tsx has src={item.poster_path ? ... : ''}
  code = code.replace(/ : ''\}/g, " : undefined}");
  
  fs.writeFileSync(file, code);
}

fixFile('src/components/LiveTvScreen.tsx');
fixFile('src/components/LiveTvRail.tsx');
fixFile('src/components/AdminPanel.tsx');

console.log('Fixed src tags');
