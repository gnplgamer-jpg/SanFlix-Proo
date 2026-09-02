const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Update Channel interface
code = code.replace(
  "export interface Channel {\n  id: string;\n  name: string;\n  logo: string;\n  category: string;\n  url: string;\n}",
  "export interface Channel {\n  id: string;\n  name: string;\n  logo: string;\n  category: string;\n  url: string;\n  nowPlaying?: string;\n}"
);
code = code.replace(
  "interface Channel {\n  id: string;\n  name: string;\n  logo: string;\n  category: string;\n  url: string;\n}",
  "interface Channel {\n  id: string;\n  name: string;\n  logo: string;\n  category: string;\n  url: string;\n  nowPlaying?: string;\n}"
);

// 2. Add nowPlaying to FALLBACK_CHANNELS
code = code.replace(
  "name: 'Aaj Tak HD', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png', url: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8' }",
  "name: 'Aaj Tak HD', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png', url: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8', nowPlaying: 'Breaking News: Election Coverage' }"
).replace(
  "name: 'Al Jazeera', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/1200px-Aljazeera_eng.svg.png', url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' }",
  "name: 'Al Jazeera', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/1200px-Aljazeera_eng.svg.png', url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8', nowPlaying: 'Inside Story' }"
).replace(
  "name: 'Bloomberg', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bloomberg_Television_logo.svg/1200px-Bloomberg_Television_logo.svg.png', url: 'https://live.bloomberg.com/news/master.m3u8' }",
  "name: 'Bloomberg', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bloomberg_Television_logo.svg/1200px-Bloomberg_Television_logo.svg.png', url: 'https://live.bloomberg.com/news/master.m3u8', nowPlaying: 'Bloomberg Surveillance' }"
).replace(
  "name: 'Red Bull TV', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' }",
  "name: 'Red Bull TV', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8', nowPlaying: 'UCI Mountain Bike World Cup' }"
).replace(
  "name: 'CGTN', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/CGTN_logo.svg/1200px-CGTN_logo.svg.png', url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8' }",
  "name: 'CGTN', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/CGTN_logo.svg/1200px-CGTN_logo.svg.png', url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8', nowPlaying: 'Global Watch' }"
).replace(
  "name: 'India Today', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/India_Today.png', url: 'https://feeds.intoday.in/indiatoday/api/indiatodayhd/master.m3u8' }",
  "name: 'India Today', category: 'News', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/India_Today.png', url: 'https://feeds.intoday.in/indiatoday/api/indiatodayhd/master.m3u8', nowPlaying: 'News Today' }"
).replace(
  "name: 'Republic TV', category: 'Popular', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Republic_TV.png', url: 'https://live.republicworld.com/live/republic/playlist.m3u8' }",
  "name: 'Republic TV', category: 'Popular', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Republic_TV.png', url: 'https://live.republicworld.com/live/republic/playlist.m3u8', nowPlaying: 'The Debate' }"
).replace(
  "name: 'Bhojpuri Cinema', category: 'Bhojpuri', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Bhojpuri_Cinema.png', url: 'https://cdn-1.pishow.tv/live/1211/master.m3u8' }",
  "name: 'Bhojpuri Cinema', category: 'Bhojpuri', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Bhojpuri_Cinema.png', url: 'https://cdn-1.pishow.tv/live/1211/master.m3u8', nowPlaying: 'Blockbuster Movie' }"
).replace(
  "name: 'Bollywood Hits', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Movies.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8' }",
  "name: 'Bollywood Hits', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Movies.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8', nowPlaying: 'Top 50 Hindi Songs' }"
).replace(
  "name: 'Sports 18', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sports18_1_HD.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' }",
  "name: 'Sports 18', category: 'Sports', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sports18_1_HD.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8', nowPlaying: 'Live Match' }"
).replace(
  "name: 'Sony MAX', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Max.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8' }",
  "name: 'Sony MAX', category: 'Hindi Movies', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Max.png', url: 'https://tvsen3.aynaott.com/jzT482XQ/index.m3u8', nowPlaying: 'Sooryavansham' }"
);

// Add hoveredChannel state inside component
const componentStart = "export function LiveTvScreen() {";
const stateToAdd = `\n  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);\n  const touchTimer = useRef<NodeJS.Timeout | null>(null);\n`;
code = code.replace(componentStart, componentStart + stateToAdd);

// Find the channel mapping and replace the main wrapper
const originalChannelDiv = `<div
                key={channel.id}
                onClick={() => {
                  setCurrentChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={\`cursor-pointer flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group \${
                  currentChannel?.id === channel.id 
                    ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800'
                }\`}
              >`;

const updatedChannelDiv = `<div
                key={channel.id}
                onClick={() => {
                  setCurrentChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
                onTouchStart={() => {
                  touchTimer.current = setTimeout(() => {
                    setHoveredChannel(channel.id);
                  }, 500);
                }}
                onTouchEnd={() => {
                  if (touchTimer.current) clearTimeout(touchTimer.current);
                  setHoveredChannel(null);
                }}
                onTouchMove={() => {
                  if (touchTimer.current) clearTimeout(touchTimer.current);
                  setHoveredChannel(null);
                }}
                onContextMenu={(e) => {
                  if (hoveredChannel === channel.id) {
                    e.preventDefault();
                  }
                }}
                className={\`relative cursor-pointer flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group overflow-hidden \${
                  currentChannel?.id === channel.id 
                    ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800'
                }\`}
              >
                {/* Now Playing Overlay */}
                <div 
                  className={\`absolute inset-0 bg-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300 \${hoveredChannel === channel.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}
                >
                  <span className="text-[10px] text-red-500 font-bold mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    NOW PLAYING
                  </span>
                  <p className="text-white text-xs font-medium line-clamp-3 px-2">
                    {channel.nowPlaying || 'Live Broadcast'}
                  </p>
                </div>`;

code = code.replace(originalChannelDiv, updatedChannelDiv);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed LiveTvScreen.tsx hover state');
