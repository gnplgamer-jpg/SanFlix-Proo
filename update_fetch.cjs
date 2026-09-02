const fs = require('fs');

const codeToReplace = `      const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
          const premiumChannels = FALLBACK_CHANNELS;
          setChannels(premiumChannels);
          let selected = currentChannel || premiumChannels[0];
          localStorage.removeItem('pendingLiveChannel');
          if (!currentChannel) {
            setCurrentChannel(selected);
          }
        } catch (err) {
          console.error("M3U parse error", err);
          setChannels(FALLBACK_CHANNELS);
          setCurrentChannel(FALLBACK_CHANNELS[0]);
        } finally {
          setIsLoading(false);
        }
      };`;

const replacementCode = `      const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('https://iptv-org.github.io/iptv/countries/in.m3u');
          const m3u = await response.text();
          
          const lines = m3u.split('\\n');
          const iptvChannels = [];
          let currentCh = {};
          
          for (const line of lines) {
            if (line.startsWith('#EXTINF:')) {
              const logoMatch = line.match(/tvg-logo="([^"]+)"/);
              const groupMatch = line.match(/group-title="([^"]+)"/);
              const commaIndex = line.lastIndexOf(',');
              const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown';
              
              currentCh = {
                id: 'iptv_' + Math.random().toString(36).substr(2, 9),
                logo: logoMatch ? logoMatch[1] : '',
                category: groupMatch ? groupMatch[1] : 'Other',
                name: name,
                nowPlaying: 'Live Stream'
              };
            } else if (line.trim() !== '' && !line.startsWith('#')) {
              currentCh.url = line.trim();
              if (currentCh.name && currentCh.url) {
                iptvChannels.push(currentCh);
              }
              currentCh = {};
            }
          }

          const allChannels = [...FALLBACK_CHANNELS, ...iptvChannels];
          setChannels(allChannels);
          
          let selected = currentChannel || allChannels[0];
          localStorage.removeItem('pendingLiveChannel');
          if (!currentChannel) {
            setCurrentChannel(selected);
          }
        } catch (err) {
          console.error("M3U fetch error", err);
          setChannels(FALLBACK_CHANNELS);
          if (!currentChannel) {
            setCurrentChannel(FALLBACK_CHANNELS[0]);
          }
        } finally {
          setIsLoading(false);
        }
      };`;

let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Use a regex in case indentation is slightly different
const regex = /const fetchPlaylists = async \(\) => \{[\s\S]*?setIsLoading\(false\);\s*\}\s*\};/g;

if (regex.test(code)) {
    code = code.replace(regex, replacementCode);
    fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
    console.log('Successfully updated fetchPlaylists');
} else {
    console.log('Could not find fetchPlaylists block to replace.');
}
