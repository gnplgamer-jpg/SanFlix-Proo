const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Replace the fallback channels with better ones that usually have CORS enabled
const newFallbacks = `const FALLBACK_CHANNELS: Channel[] = [
  { id: '1', name: 'DD News', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/DD_News.svg/1200px-DD_News.svg.png', url: 'https://nicls2-live.nic.in/nic-ls2/ls2-2.m3u8' },
  { id: '2', name: 'Al Jazeera', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/1200px-Aljazeera_eng.svg.png', url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
  { id: '3', name: 'Sky News', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Sky_News_logo_2020.svg/1200px-Sky_News_logo_2020.svg.png', url: 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8' },
  { id: '4', name: 'Red Bull TV', category: 'Sports', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Red_Bull_TV_logo.svg/2048px-Red_Bull_TV_logo.svg.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },
  { id: '5', name: 'Bloomberg', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bloomberg_Television_logo.svg/1200px-Bloomberg_Television_logo.svg.png', url: 'https://live.bloomberg.com/news/master.m3u8' },
  { id: '6', name: 'CGTN', category: 'News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/CGTN_logo.svg/1200px-CGTN_logo.svg.png', url: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8' },
];`;

code = code.replace(/const FALLBACK_CHANNELS: Channel\[\] = \[[\s\S]*?\];/, newFallbacks);

// 2. Only allow https URLs when parsing the m3u
code = code.replace(
  `} else if (line.startsWith('http')) {`,
  `} else if (line.startsWith('https://')) {`
);

// 3. Improve HLS error handling - only show offline on fatal network/media errors
const oldError = `hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setPlayerError(true);
        }
      });`;
const newError = `hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              hls.destroy();
              setPlayerError(true);
              break;
          }
        }
      });`;

code = code.replace(oldError, newError);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('patched live tv cors');
