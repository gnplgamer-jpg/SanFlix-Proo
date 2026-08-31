const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const routeToAdd = `  app.get("/api/tmdb/person/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        return res.json({ profile_path: null });
      }

      const response = await fetch(\`https://api.themoviedb.org/3/person/\${id}?api_key=\${tmdbKey}\`);
      if (!response.ok) {
         return res.status(response.status).json({ error: 'Failed to fetch person' });
      }
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Person Error:", e.message);
      res.status(500).json({ error: "Failed to fetch person" });
    }
  });

  // API Route for TMDB Details`;

code = code.replace("  // API Route for TMDB Details", routeToAdd);
fs.writeFileSync('server.ts', code);
