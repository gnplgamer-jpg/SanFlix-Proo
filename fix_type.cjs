const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/    movie: any;\n  const \[isSubscribed, setIsSubscribed\] = useState\(\(\) => localStorage\.getItem\('SANFLIX_PRO_SUBSCRIBED'\) === 'true'\);\n  const \[showSubscribePopup, setShowSubscribePopup\] = useState\(\(\) => !localStorage\.getItem\('SANFLIX_PRO_SUBSCRIBED'\)\);\n  const \[pendingMovieForSubscribe, setPendingMovieForSubscribe\] = useState<any>\(null\);\n\n    timeLeft: number;\n  } \| null>\(null\);/, 
  `    movie: any;\n    timeLeft: number;\n  } | null>(null);\n\n  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem('SANFLIX_PRO_SUBSCRIBED') === 'true');\n  const [showSubscribePopup, setShowSubscribePopup] = useState(() => !localStorage.getItem('SANFLIX_PRO_SUBSCRIBED'));\n  const [pendingMovieForSubscribe, setPendingMovieForSubscribe] = useState<any>(null);`);

fs.writeFileSync('src/App.tsx', code);
