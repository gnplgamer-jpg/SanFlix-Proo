const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.get("/api/proxy/video", async (req, res) => {`;
const newStr = `  // PHUB Trending API Proxy
  app.get("/api/phub-trending", async (req, res) => {
    try {
      const response = await fetch('https://pornhub-api-xnxx.p.rapidapi.com/api/trending?page=1', {
        headers: {
          'x-rapidapi-host': 'pornhub-api-xnxx.p.rapidapi.com',
          'x-rapidapi-key': '8ec1489348msh9f97ee5a9a78f85p1c5eafjsnd6b122f32963'
        }
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch" });
      }
      const data = await response.json();
      res.json({ videos: data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/proxy/video", async (req, res) => {`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('server.ts', code);
