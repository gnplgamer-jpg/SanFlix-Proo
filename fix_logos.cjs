const fs = require('fs');

function fixFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace onError handlers
  code = code.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = 'https:\/\/via\.placeholder\.com[^']*'\)\}/g, 
    "onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel?.name || 'TV')}&background=ef4444&color=fff&bold=true`)}");

  // Fix currentChannel logo fallback in LiveTvScreen
  code = code.replace(/src=\{currentChannel\.logo \|\| 'https:\/\/via\.placeholder\.com\/150'\}/g,
    "src={currentChannel.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChannel?.name || 'TV')}&background=ef4444&color=fff&bold=true`}");
    
  code = code.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = 'https:\/\/via\.placeholder\.com[^']*'\)\}/g, 
    "onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentChannel?.name || 'TV')}&background=ef4444&color=fff&bold=true`)}");

  // Fix logo parsing default in LiveTvScreen
  code = code.replace(/logo: logoMatch \? logoMatch\[1\] : 'https:\/\/via\.placeholder\.com[^']*'/g,
    "logo: logoMatch ? logoMatch[1] : `https://ui-avatars.com/api/?name=${encodeURIComponent(groupMatch ? groupMatch[1] : 'TV')}&background=ef4444&color=fff&bold=true`");

  fs.writeFileSync(filePath, code);
}

fixFile('src/components/LiveTvScreen.tsx');
fixFile('src/components/LiveTvRail.tsx');

console.log('Fixed logos');
