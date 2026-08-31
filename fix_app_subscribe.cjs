const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import
content = content.replace(/import \{ SubscribeModal \} from '\.\/components\/SubscribeModal';\n/, '');

// Remove states
content = content.replace(/const \[isSubscribed, setIsSubscribed\] = useState\(\(\) => localStorage.getItem\('SANFLIX_PRO_SUBSCRIBED'\) === 'true'\);\n/, '');
content = content.replace(/const \[showSubscribePopup, setShowSubscribePopup\] = useState\(\(\) => !localStorage.getItem\('SANFLIX_PRO_SUBSCRIBED'\)\);\n/, '');
content = content.replace(/const \[pendingMovieForSubscribe, setPendingMovieForSubscribe\] = useState<any>\(null\);\n/, '');

// Remove popup JSX
content = content.replace(/<AnimatePresence>\s*\{showSubscribePopup && \([\s\S]*?<\/AnimatePresence>/m, '');

// Remove isSubscribed from PlayerModal props
content = content.replace(/isSubscribed=\{isSubscribed\}/g, '');

fs.writeFileSync('src/App.tsx', content);
