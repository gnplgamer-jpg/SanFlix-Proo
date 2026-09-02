const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The player modal renders DirectVideoPlayer
const playerModalRegex = /<PlayerModal[\s\S]*?\/>/m;

const oldDirectPlayerRegex = /<DirectVideoPlayer[\s\S]*?onShowQualitySelector=\{\(\) => \{[^}]*\}\}[\s\S]*?\/>/m;

code = code.replace(/<DirectVideoPlayer\s+url=\{globalVideo\.url\}/, `<DirectVideoPlayer
            isPremium={user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true'}
            onRequirePremium={() => {
               setGlobalVideo(null);
               setShowPremiumModal(true);
            }}
            url={globalVideo.url}`);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx with DirectVideoPlayer premium props');
