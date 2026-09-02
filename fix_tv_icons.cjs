const fs = require('fs');

function replaceIcons(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Use a simple, reliable placeholder logic
  const replaceStr = "onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String((e.currentTarget as any).alt || 'TV').substring(0, 3))}`; }}";
  code = code.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = '[^']*'\)\}/g, replaceStr);
  code = code.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = `[^`]*`\)\}/g, replaceStr);
  
  // Replace fallback src logic directly if it's there
  code = code.replace(/src=\{currentChannel\.logo \|\| '[^']*'\}/g, "src={currentChannel.logo || `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String(currentChannel.name || 'TV').substring(0,3))}`}");
  
  fs.writeFileSync(file, code);
}

replaceIcons('src/components/LiveTvRail.tsx');
replaceIcons('src/components/LiveTvScreen.tsx');
console.log('Fixed TV Icons');
