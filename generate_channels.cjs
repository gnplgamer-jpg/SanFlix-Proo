const fs = require('fs');

const channels = [
  // Hindi GEC
  { name: "Star Plus", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Plus_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Sony Entertainment Television", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Colors", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Colors_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Zee TV", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_TV_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Star Bharat", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Bharat_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Sony SAB", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_SAB_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Dangal", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Dangal.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  
  // Hindi Movies
  { name: "Star Gold", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Gold_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Sony MAX", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Max_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Zee Cinema", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Cinema_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Colors Cineplex", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Colors_Cineplex_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "B4U Movies", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Movies.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // Sports
  { name: "Star Sports 1", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Sports_1_HD.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "Sony Ten 1", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Ten_1_HD.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "Sports18 1 HD", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sports18_1_HD.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "Eurosport India", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Eurosport_HD.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "DD Sports", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/DD_Sports.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },

  // Kids
  { name: "Cartoon Network", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Cartoon_Network.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Pogo TV", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Pogo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Nickelodeon", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Nick.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Disney Channel", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Disney.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Sony YAY!", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_YAY.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // Infotainment
  { name: "Discovery Channel", category: "Infotainment", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Discovery_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "National Geographic", category: "Infotainment", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Nat_Geo_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "History TV18", category: "Infotainment", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/History_TV18_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Animal Planet", category: "Infotainment", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Animal_Planet_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // News
  { name: "Aaj Tak", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png", url: "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8" },
  { name: "ABP News", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/ABP_News.png", url: "https://abp-i.akamaihd.net/hls/live/765529/abphindi/master.m3u8" },
  { name: "India TV", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/India_TV.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Zee News", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_News.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "News18 India", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/News18_India.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  
  // Music
  { name: "MTV", category: "Music", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/MTV_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "9XM", category: "Music", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/9XM.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Zoom", category: "Music", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zoom.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "B4U Music", category: "Music", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Music.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // Doordarshan
  { name: "DD National", category: "Doordarshan", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/DD_National.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "DD News", category: "Doordarshan", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/DD_News.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // Regional
  { name: "Zee Marathi", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Marathi_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Star Jalsha", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Jalsha_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Sun TV", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sun_TV_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "PTC Punjabi", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/PTC_Punjabi.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Bhojpuri Cinema", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Bhojpuri_Cinema.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },

  // Nepal
  { name: "Nepal Television (NTV)", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/2/23/Nepal_Television_Logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Kantipur TV HD", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Kantipur_Television_Logo.png/220px-Kantipur_Television_Logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "AP1 HD", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Ap1_logo.png/220px-Ap1_logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "Himalaya TV", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Himalaya_TV.jpg/200px-Himalaya_TV.jpg", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" },
  { name: "News24 Nepal", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/4/4e/News24_Nepal_logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8" }
].map((c, i) => ({
  id: (i + 1).toString(),
  name: c.name,
  category: c.category,
  logo: c.logo,
  url: c.url,
  nowPlaying: "Live Stream"
}));

let content = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Replace FALLBACK_CHANNELS array
const regex = /const FALLBACK_CHANNELS: Channel\[\] = \[[\s\S]*?\];/;
const replacement = `const FALLBACK_CHANNELS: Channel[] = ${JSON.stringify(channels, null, 2)};`;

content = content.replace(regex, replacement);

// Replace HLS initialization to be optimized for Wifi buffering (Smooth Wifi)
const hlsRegex = /const hls = new Hls\(\{\s*enableWorker: true,\s*lowLatencyMode: true,?\s*\}\);/;
const hlsReplacement = `const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30, // Optimized for smooth wifi
        maxMaxBufferLength: 60,
        startLevel: -1,
        capLevelToPlayerSize: true,
      });`;

content = content.replace(hlsRegex, hlsReplacement);

// Re-write coreCategories to include exactly these user-requested ones
const catRegex = /const coreCategories = \[.*?\];/;
const catReplacement = `const coreCategories = ['All', 'Favorites', 'Hindi GEC', 'Hindi Movies', 'Sports', 'Kids', 'Infotainment', 'News', 'Music', 'Doordarshan', 'Regional', 'Nepal'];`;
content = content.replace(catRegex, catReplacement);


fs.writeFileSync('src/components/LiveTvScreen.tsx', content);
console.log('Channels and HLS smooth wifi integrated successfully!');

