const https = require('https');

const missing = [
  'Aliya Naaz',
  'Mahi Kaur',
  'Bharti Jha',
  'Jinnie Jaaz',
  'Hiral Radadiya'
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  for (const name of missing) {
    try {
      const q = encodeURIComponent(name);
      // IMDb search API
      const searchHtml = await fetchHtml(`https://v3.sg.media-imdb.com/suggestion/x/${q}.json`);
      const data = JSON.parse(searchHtml);
      if (data && data.d && data.d.length > 0) {
         for (const item of data.d) {
             if (item.i && item.i.imageUrl) {
                 console.log(`  { name: '${name}', imageUrl: '${item.i.imageUrl}' },`);
                 break;
             }
         }
      }
    } catch (e) {
      console.log(`Failed for ${name}`);
    }
  }
}

run();
