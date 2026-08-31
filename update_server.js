const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.get("/api/proxy/video", async (req, res) => {`;

const newStr = `  // API Route for Trending Videos via RapidAPI
  app.get("/api/trending-videos", async (req, res) => {
    try {
      const rapidApiKey = process.env.RAPIDAPI_KEY;
      const rapidApiHost = process.env.RAPIDAPI_HOST;
      const rapidApiUrl = process.env.RAPIDAPI_URL;

      if (!rapidApiKey || !rapidApiHost || !rapidApiUrl) {
        // Return mock data if not configured
        return res.json({
          videos: [
            { title: "Configure your RAPIDAPI_KEY, HOST and URL in secrets", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { title: "Mock Trending Video 1", embed_url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
            { title: "Mock Trending Video 2", embed_url: "https://www.youtube.com/embed/9bZkp7q19f0" },
          ]
        });
      }

      const response = await fetch(rapidApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": rapidApiHost,
          "x-rapidapi-key": rapidApiKey
        }
      });

      if (!response.ok) {
         return res.status(response.status).json({ error: "Failed to fetch trending videos" });
      }

      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("Trending Videos API Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from API" });
    }
  });

  app.get("/api/proxy/video", async (req, res) => {`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('server.ts', code);
