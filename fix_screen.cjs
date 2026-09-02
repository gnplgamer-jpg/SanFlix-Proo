const fs = require('fs');
let player = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');
player = player.replace(/ScreenOrientation\.lock/g, '(ScreenOrientation as any).lock');
fs.writeFileSync('src/components/DirectVideoPlayer.tsx', player);
console.log('Fixed ScreenOrientation');
