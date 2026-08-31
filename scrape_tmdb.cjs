const https = require('https');

const actresses = [
  { name: 'Aliya Naaz', tmdbId: 3004810 },
  { name: 'Sneha Paul', tmdbId: 3062325 },
  { name: 'Ayesha Kapoor', tmdbId: 3072213 },
  { name: 'Mahi Kaur', tmdbId: 3020108 },
  { name: 'Anveshi Jain', tmdbId: 2197825 },
  { name: 'Flora Saini', tmdbId: 1618035 },
  { name: 'Priya Gamre', tmdbId: 1386701 },
  { name: 'Bharti Jha', tmdbId: 3878235 },
  { name: 'Jinnie Jaaz', tmdbId: 2884240 },
  { name: 'Hiral Radadiya', tmdbId: 3014138 },
  { name: 'Rekha Mona Sarkar', tmdbId: 3089679 },
  { name: 'Muskan Agarwal', tmdbId: 3514736 },
  { name: 'Shyna Khatri', tmdbId: 3881260 },
  { name: 'Neha Gupta', tmdbId: 3450982 },
  { name: 'Kavita Radheshyam', tmdbId: 1395562 }
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
  const results = [];
  for (const a of actresses) {
    try {
      const html = await fetchHtml(`https://www.themoviedb.org/person/${a.tmdbId}`);
      // find meta property="og:image" content="https://image.tmdb.org/t/p/w.../something.jpg"
      const match = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (match && match[1] && !match[1].includes('no-poster')) {
        let imgUrl = match[1];
        results.push(`{ name: '${a.name}', tmdbId: ${a.tmdbId}, imageUrl: '${imgUrl}' },`);
      } else {
        results.push(`{ name: '${a.name}', tmdbId: ${a.tmdbId} },`);
      }
    } catch (e) {
       results.push(`{ name: '${a.name}', tmdbId: ${a.tmdbId} },`);
    }
  }
  console.log(results.join('\n'));
}

run();
