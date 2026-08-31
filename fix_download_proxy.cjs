const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetProxy = `  app.get("/api/proxy/video", async (req, res) => {`;
const downloadProxy = `  app.get("/api/proxy/download", async (req, res) => {
    try {
      const videoUrl = req.query.url as string;
      const title = (req.query.title as string) || "video.mp4";
      if (!videoUrl) return res.status(400).send("Missing URL");
      
      let referer = "https://pixeldrain.com/";
      try {
          const parsedUrl = new URL(videoUrl);
          referer = parsedUrl.origin + "/";
      } catch(e) {}

      const headers: any = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": referer,
        "Connection": "keep-alive"
      };

      let targetUrl = videoUrl;
      let redirectCount = 0;
      let response;

      while (redirectCount < 5) {
        response = await fetch(targetUrl, { headers, redirect: 'manual' });
        if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
          let location = response.headers.get('location');
          
          if (location) {
            targetUrl = location.startsWith('http') ? location : new URL(location, targetUrl).toString();
            
            // Extract confirm token from Set-Cookie if it's google drive
            if ((targetUrl.includes('drive.google.com') || targetUrl.includes('drive.usercontent.google.com')) && response.headers.has('set-cookie')) {
               const cookies = response.headers.get('set-cookie');
               if (cookies && cookies.includes('download_warning_')) {
                  const tokenMatch = cookies.match(/download_warning_[^=]+=(.*?)(?:;|$)/);
                  if (tokenMatch) {
                     targetUrl += \`&confirm=\${tokenMatch[1]}\`;
                  }
               }
            }
            
            redirectCount++;
            continue;
          }
        } else if (response.status === 200 && (targetUrl.includes('drive.google.com') || targetUrl.includes('drive.usercontent.google.com')) && response.headers.get('content-type')?.includes('text/html')) {
           const html = await response.text();
           const match = html.match(/confirm=([a-zA-Z0-9-_]+)/);
           if (match) {
               targetUrl = \`\${targetUrl}&confirm=\${match[1]}\`;
               redirectCount++;
               continue;
           }
        }
        break;
      }

      if (!response) {
         return res.status(500).send("Failed to fetch");
      }
      
      // Copy response headers
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-disposition' && key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'content-encoding') {
          res.setHeader(key, value);
        }
      });
      
      // Force download attachment
      res.setHeader('Content-Disposition', \`attachment; filename="\${encodeURIComponent(title)}.mp4"\`);
      
      res.status(response.status);

      if (response.body) {
        Readable.fromWeb(response.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (e: any) {
      console.error("Download Proxy Error:", e.message);
      res.status(500).end();
    }
  });

  app.get("/api/proxy/video", async (req, res) => {`;

if (!code.includes('app.get("/api/proxy/download"')) {
   code = code.replace(targetProxy, downloadProxy);
   fs.writeFileSync('server.ts', code);
   console.log("Added /api/proxy/download route");
} else {
   console.log("Download route already exists");
}
