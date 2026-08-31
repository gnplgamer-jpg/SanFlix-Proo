const https = require('https');
const API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

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

async function fetchProfile(id) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const results = [];
  for (const a of actresses) {
    try {
      const data = await fetchProfile(a.tmdbId);
      if (data.profile_path) {
        results.push(`  { name: '${a.name}', tmdbId: ${a.tmdbId}, imageUrl: 'https://image.tmdb.org/t/p/w185${data.profile_path}' },`);
      } else {
        // Try searching by name as fallback
        const searchData = await new Promise((resolve) => {
          https.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(a.name)}`, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
          });
        });
        let foundUrl = null;
        if (searchData.results && searchData.results.length > 0) {
            for (const res of searchData.results) {
               if (res.profile_path) {
                  foundUrl = `https://image.tmdb.org/t/p/w185${res.profile_path}`;
                  break;
               }
            }
        }
        
        if (foundUrl) {
            results.push(`  { name: '${a.name}', tmdbId: ${a.tmdbId}, imageUrl: '${foundUrl}' },`);
        } else {
            results.push(`  { name: '${a.name}', tmdbId: ${a.tmdbId} },`);
        }
      }
    } catch (e) {
      results.push(`  { name: '${a.name}', tmdbId: ${a.tmdbId} },`);
    }
  }
  console.log(results.join('\n'));
}

run();
