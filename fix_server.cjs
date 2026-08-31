const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const findRoute = `
  // API Route for TMDB Find (IMDB ID)
  app.get("/api/tmdb/find/:id", async (req, res) => {
    try {
      const externalId = req.params.id;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        return res.json({
          movie_results: [
            {
              id: 999999,
              title: "Mock Movie Find Result",
              media_type: "movie"
            }
          ],
          tv_results: []
        });
      }

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await fetch(\`https://api.themoviedb.org/3/find/\${externalId}?external_source=imdb_id&api_key=\${tmdbKey}\`);
          if (response.ok) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: \`Failed to fetch TMDB find: \${response?.statusText}\` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Find Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB find", details: e.message });
    }
  });
`;

code = code.replace(/  \/\/ API Route for TMDB Details \(videos and genres\)/, findRoute + '\n  // API Route for TMDB Details (videos and genres)');
fs.writeFileSync('server.ts', code);
