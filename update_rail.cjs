const fs = require('fs');

const channels = [
  // A curated mix to look good on the Trending Rail
  { name: "Star Plus", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Plus_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Anupamaa" },
  { name: "Sony Entertainment Television", category: "Hindi GEC", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Kaun Banega Crorepati" },
  { name: "Aaj Tak", category: "News", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png", url: "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8", nowPlaying: "Breaking News" },
  { name: "Star Sports 1", category: "Sports", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Sports_1_HD.png", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8", nowPlaying: "Live Match" },
  { name: "Cartoon Network", category: "Kids", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Cartoon_Network.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Tom and Jerry" },
  { name: "Nepal Television (NTV)", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/2/23/Nepal_Television_Logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "NTV News" },
  { name: "Star Gold", category: "Hindi Movies", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Gold_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Blockbuster Movie" },
  { name: "Zee Marathi", category: "Regional", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Marathi_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Swarajya Rakshak Sambhaji" },
  { name: "Discovery Channel", category: "Infotainment", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Discovery_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Man vs. Wild" },
  { name: "MTV", category: "Music", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/MTV_HD.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "MTV Splitsvilla" },
  { name: "Kantipur TV HD", category: "Nepal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Kantipur_Television_Logo.png/220px-Kantipur_Television_Logo.png", url: "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8", nowPlaying: "Kantipur Samachar" }
].map((c, i) => ({
  id: "trend_" + (i + 1).toString(),
  name: c.name,
  category: c.category,
  logo: c.logo,
  url: c.url,
  nowPlaying: c.nowPlaying
}));

let content = fs.readFileSync('src/components/LiveTvRail.tsx', 'utf8');

// The array goes from `const trendingLiveChannels = [` up to `];` before `export function LiveTvRail`
const regex = /const trendingLiveChannels:?.*? = \[[\s\S]*?\];/;
const replacement = `const trendingLiveChannels = ${JSON.stringify(channels, null, 2)};`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/LiveTvRail.tsx', content);
console.log('Rail updated successfully!');
