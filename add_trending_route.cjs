const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const trendingRoute = `  // API Route for TMDB Trending Upcoming/Latest
  app.get("/api/meta-data/trending-tmdb", async (req, res) => {
    try {
      const tmdbKey = process.env.TMDB_API_KEY;
      if (!tmdbKey) {
         return res.json({ results: [] });
      }
      const response = await fetch(\`https://api.themoviedb.org/3/trending/all/week?api_key=\${tmdbKey}&language=en-US\`);
      const data = await response.json();
      res.json(data);
    } catch(e) {
      res.status(500).json({ error: "Failed" });
    }
  });

  // API Route for TMDB Searching`;

if (!code.includes('/api/meta-data/trending-tmdb')) {
  code = code.replace('  // API Route for TMDB Searching', trendingRoute);
  fs.writeFileSync('server.ts', code);
  console.log("Added trending TMDB route");
}
