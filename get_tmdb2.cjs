const https = require('https');

const names = [
  "Deepika Padukone",
  "Mrunal Thakur",
  "Rashmika Mandanna",
  "Kareena Kapoor",
  "Kangana Ranaut",
  "Shraddha Kapoor"
];

function searchTMDB(name) {
  return new Promise((resolve, reject) => {
    const url = `https://api.themoviedb.org/3/search/person?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${encodeURIComponent(name)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            resolve(parsed.results[0]);
          } else {
            resolve(null);
          }
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const name of names) {
    const person = await searchTMDB(name);
    if (person && person.profile_path) {
      console.log(`  { name: '${name}', tmdbId: ${person.id}, imageUrl: 'https://image.tmdb.org/t/p/w185${person.profile_path}' },`);
    }
  }
}
run();
