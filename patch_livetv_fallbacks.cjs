const fs = require('fs');

let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Add fallbackUrls to interface
code = code.replace(/url: string;/, 'url: string;\n  fallbackUrls?: string[];');

// 2. Modify parsing logic to group by name
const fetchRegex = /for \(const line of lines\) \{[\s\S]*?const allChannels = \[\.\.\.FALLBACK_CHANNELS, \.\.\.iptvChannels\];/;
const fetchReplacement = `const channelMap = new Map<string, Channel>();

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
                const existing = channelMap.get(currentCh.name.toLowerCase());
                if (existing) {
                   if (!existing.fallbackUrls) existing.fallbackUrls = [];
                   existing.fallbackUrls.push(currentCh.url);
                } else {
                   channelMap.set(currentCh.name.toLowerCase(), currentCh as Channel);
                }
              }
              currentCh = {};
            }
          }
          const iptvChannels = Array.from(channelMap.values());
          const allChannels = [...FALLBACK_CHANNELS, ...iptvChannels];`;

code = code.replace(fetchRegex, fetchReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Patched HLS interface and fetching logic.');
