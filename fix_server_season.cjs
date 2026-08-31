const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const seasonRoute = `
  // API Route for TMDB Season Details
  app.get("/api/tmdb/season/:id/:seasonNumber", async (req, res) => {
    try {
      const { id, seasonNumber } = req.params;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        return res.json({
          episodes: []
        });
      }

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await fetch(\`https://api.themoviedb.org/3/tv/\${id}/season/\${seasonNumber}?api_key=\${tmdbKey}\`);
          if (response.ok) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: \`Failed to fetch TMDB season: \${response?.statusText}\` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Season Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB season", details: e.message });
    }
  });
`;

code = code.replace(/  \/\/ API Route for TMDB Details/, seasonRoute + '\n  // API Route for TMDB Details');
fs.writeFileSync('server.ts', code);
