const fs = require('fs');

const CHANNELS = `[
  { id: '1', name: 'Aaj Tak HD', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png', url: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8' },
  { id: '2', name: 'Al Jazeera', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/1200px-Aljazeera_eng.svg.png', url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
  { id: '3', name: 'Bloomberg', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bloomberg_Television_logo.svg/1200px-Bloomberg_Television_logo.svg.png', url: 'https://live.bloomberg.com/news/master.m3u8' },
  { id: '4', name: 'Red Bull TV', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },
  { id: '5', name: 'CGTN', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/CGTN_logo.svg/1200px-CGTN_logo.svg.png', url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8' },
  { id: '6', name: 'India Today', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/India_Today.png', url: 'https://feeds.intoday.in/indiatoday/api/indiatodayhd/master.m3u8' },
  { id: '7', name: 'Republic TV', category: 'Popular', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Republic_TV.png', url: 'https://live.republicworld.com/live/republic/playlist.m3u8' },
  { id: '8', name: 'Bhojpuri Cinema', category: 'Bhojpuri', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Bhojpuri_Cinema.png', url: 'https://cdn-1.pishow.tv/live/1211/master.m3u8' },
  { id: '9', name: 'Bollywood Hits', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Movies.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8' },
  { id: '10', name: 'Sports 18', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sports18_1_HD.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },
  { id: '11', name: 'Sony MAX', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Max.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8' },
]`;

// Update LiveTvRail.tsx
let rail = fs.readFileSync('src/components/LiveTvRail.tsx', 'utf8');
rail = rail.replace(/export const trendingLiveChannels: Channel\[\] = \[[\s\S]*?\];/, "export const trendingLiveChannels: Channel[] = " + CHANNELS + ";");
rail = rail.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = `https:\/\/ui-avatars[^`]*`\)\}/g, "onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x150/1f2937/ef4444?text=TV')}");
fs.writeFileSync('src/components/LiveTvRail.tsx', rail);

// Update LiveTvScreen.tsx
let screen = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');
screen = screen.replace(/const FALLBACK_CHANNELS: Channel\[\] = \[[\s\S]*?\];/, "const FALLBACK_CHANNELS: Channel[] = " + CHANNELS + ";");

const newFetch = `      const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
          const premiumChannels = FALLBACK_CHANNELS;
          setChannels(premiumChannels);
          let selected = premiumChannels[0];
          try {
            const pending = localStorage.getItem('pendingLiveChannel');
            if (pending) {
              const parsed = JSON.parse(pending);
              selected = premiumChannels.find(c => c.name === parsed.name) || parsed;
              localStorage.removeItem('pendingLiveChannel');
            }
          } catch (e) { }
          setCurrentChannel(selected);
        } catch (err) {
          console.error("M3U parse error", err);
          setChannels(FALLBACK_CHANNELS);
          setCurrentChannel(FALLBACK_CHANNELS[0]);
        } finally {
          setIsLoading(false);
        }
      };`;

screen = screen.replace(/const fetchPlaylists = async \(\) => \{[\s\S]*?fetchPlaylists\(\);/m, newFetch + '\n\n    fetchPlaylists();');
screen = screen.replace(/src=\{currentChannel\.logo \|\| `https:\/\/ui-avatars[^`]*`\}/g, "src={currentChannel.logo || 'https://via.placeholder.com/150x150/1f2937/ef4444?text=TV'}");
screen = screen.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = `https:\/\/ui-avatars[^`]*`\)\}/g, "onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x150/1f2937/ef4444?text=TV')}");
screen = screen.replace(/onError=\{\(e\) => \(e\.currentTarget\.src = 'https:\/\/ui-avatars[^']*'\)\}/g, "onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x150/1f2937/ef4444?text=TV')}");

fs.writeFileSync('src/components/LiveTvScreen.tsx', screen);

console.log('Updated to premium curated channels');
