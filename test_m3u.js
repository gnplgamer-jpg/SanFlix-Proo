fetch('https://iptv-org.github.io/iptv/countries/in.m3u')
  .then(r => r.text())
  .then(m3u => {
    const lines = m3u.split('\n');
    const channels = [];
    let currentChannel = {};
    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const commaIndex = line.lastIndexOf(',');
        const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown';
        
        currentChannel = {
          id: Math.random().toString(36).substr(2, 9),
          logo: logoMatch ? logoMatch[1] : '',
          category: groupMatch ? groupMatch[1] : 'Other',
          name: name,
        };
      } else if (line.trim() !== '' && !line.startsWith('#')) {
        currentChannel.url = line.trim();
        channels.push(currentChannel);
        currentChannel = {};
      }
    }
    console.log(`Found ${channels.length} channels.`);
    console.log('First 5:', channels.slice(0, 5));
  });
