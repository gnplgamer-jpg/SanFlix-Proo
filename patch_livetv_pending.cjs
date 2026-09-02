const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

const replacementSuccess = `        setChannels(cleanedChannels);
        let selected = cleanedChannels[0];
        try {
          const pending = localStorage.getItem('pendingLiveChannel');
          if (pending) {
            const parsed = JSON.parse(pending);
            selected = cleanedChannels.find(c => c.url === parsed.url) || parsed;
            localStorage.removeItem('pendingLiveChannel');
          }
        } catch (e) { }
        
        if (cleanedChannels.length > 0 || selected) {
          setCurrentChannel(selected);
        }`;

code = code.replace(/setChannels\(cleanedChannels\);\s*if \(cleanedChannels\.length > 0\) \{\s*setCurrentChannel\(cleanedChannels\[0\]\);\s*\}/, replacementSuccess);

const replacementFail = `        setChannels(FALLBACK_CHANNELS);
        let selected = FALLBACK_CHANNELS[0];
        try {
          const pending = localStorage.getItem('pendingLiveChannel');
          if (pending) {
            const parsed = JSON.parse(pending);
            selected = FALLBACK_CHANNELS.find(c => c.url === parsed.url) || parsed;
            localStorage.removeItem('pendingLiveChannel');
          }
        } catch (e) { }
        setCurrentChannel(selected);`;

code = code.replace(/setChannels\(FALLBACK_CHANNELS\);\s*setCurrentChannel\(FALLBACK_CHANNELS\[0\]\);/, replacementFail);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('patched live tv pending channel logic');
