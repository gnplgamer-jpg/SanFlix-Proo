const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Change useState for currentChannel
code = code.replace(
  "const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);",
  `const [currentChannel, setCurrentChannel] = useState<Channel | null>(() => {
    try {
      const pending = localStorage.getItem('pendingLiveChannel');
      if (pending) {
        const parsed = JSON.parse(pending);
        return FALLBACK_CHANNELS.find(c => c.name === parsed.name) || parsed;
      }
    } catch(e) {}
    return null;
  });`
);

// 2. Change fetchPlaylists
const oldFetch = `          let selected = premiumChannels[0];
          try {
            const pending = localStorage.getItem('pendingLiveChannel');
            if (pending) {
              const parsed = JSON.parse(pending);
              selected = premiumChannels.find(c => c.name === parsed.name) || parsed;
              localStorage.removeItem('pendingLiveChannel');
            }
          } catch (e) { }
          setCurrentChannel(selected);`;

const newFetch = `          let selected = currentChannel || premiumChannels[0];
          localStorage.removeItem('pendingLiveChannel');
          if (!currentChannel) {
            setCurrentChannel(selected);
          }`;

code = code.replace(oldFetch, newFetch);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed LiveTvScreen.tsx');
