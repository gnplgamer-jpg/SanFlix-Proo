const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const checkerEndpoint = `  // API Route for Admin Link Verification
  app.get("/api/admin/check-link", async (req, res) => {
    try {
      const urlToCheck = req.query.url as string;
      if (!urlToCheck) return res.json({ ok: false, status: 400 });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(urlToCheck, {
         method: 'GET',
         headers: {
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
           "Accept": "*/*"
         },
         signal: controller.signal
      });
      clearTimeout(timeout);

      // Consider 2xx, 3xx, and even 403 as "alive" for streaming hosts (403 usually means auth required, not dead)
      // 404, 500+ usually mean dead/removed.
      if (response.status !== 404 && response.status < 500) {
         return res.json({ ok: true, status: response.status });
      } else {
         return res.json({ ok: false, status: response.status });
      }
    } catch (e: any) {
      // Network errors, timeouts, invalid URLs
      return res.json({ ok: false, status: 500, error: e.message });
    }
  });

  // API Route for TMDB Trending`;

if (!code.includes('/api/admin/check-link')) {
  code = code.replace('  // API Route for TMDB Trending', checkerEndpoint);
  fs.writeFileSync('server.ts', code);
  console.log("Added /api/admin/check-link route");
}
