import express from "express";
import { GoogleGenAI } from "@google/genai";

import path from "path";
import { createServer as createViteServer } from "vite";
import { Readable } from "stream";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());


  app.post("/api/chat", async (req, res) => {
    try {
      const { message, availableMovies } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are 'SanFlix-Pro Catt Bot', an expert movie and TV show recommendation assistant. You represent exclusively the SanFlix-Pro platform. You MUST return your answer in JSON format with two fields: 'reply' (string with your conversational response) and 'suggestions' (an array of objects for the recommended movies/shows). Each suggestion object MUST have: 'title' (string), 'imageUrl' (string), 'qualities' (an array of strings), 'type' (string). \n\nIMPORTANT: The user has a database of available movies: " + (availableMovies ? JSON.stringify(availableMovies) : "[]") + ". If their query matches any movie in this available list, you MUST include it in your 'suggestions' using the EXACT 'title', 'imageUrl', and 'qualities' provided in the available list. If it is not in the list, you can suggest other movies and try to provide a TMDB poster URL. Be sure to ONLY mention 'SanFlix-Pro' as the platform, and do NOT confuse it with or recommend other external platforms in your conversational replies.",
        }
      });
      
      let parsedResponse;
      try {
         parsedResponse = JSON.parse(response.text);
      } catch (e) {
         parsedResponse = { reply: response.text, suggestions: [] };
      }
      
      // If we have TMDB key and suggestions are missing images, try to fetch them quickly
      if (tmdbKey && parsedResponse.suggestions && parsedResponse.suggestions.length > 0) {
         for (let i = 0; i < parsedResponse.suggestions.length; i++) {
            const sug = parsedResponse.suggestions[i];
            if (!sug.imageUrl || !sug.imageUrl.startsWith('http')) {
               try {
                  const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/${sug.type === 'tv' ? 'tv' : 'movie'}?api_key=${tmdbKey}&query=${encodeURIComponent(sug.title)}&include_adult=true&language=en-US`);
                  const tmdbData = await tmdbRes.json();
                  if (tmdbData.results && tmdbData.results.length > 0 && tmdbData.results[0].poster_path) {
                     sug.imageUrl = `https://image.tmdb.org/t/p/w300${tmdbData.results[0].poster_path}`;
                  } else {
                     sug.imageUrl = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }
               } catch (e) {}
            }
         }
      }

      res.json(parsedResponse);
    } catch (e) {
      console.error("AI Chat Error:", e.message || e);
      res.status(500).json({ error: "Failed to generate AI response", details: e.message || e.toString() });
    }
  });

  // API Route for Admin Link Verification
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

  // API Route for TMDB Trending Upcoming/Latest
  app.get("/api/meta-data/trending-tmdb", async (req, res) => {
    try {
      const tmdbKey = process.env.TMDB_API_KEY;
      if (!tmdbKey) {
         return res.json({ results: [] });
      }
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${tmdbKey}&language=en-US`);
      const data = await response.json();
      res.json(data);
    } catch(e) {
      res.status(500).json({ error: "Failed" });
    }
  });

  // API Route for TMDB Searching
  app.get("/api/meta-data/search", async (req, res) => {
    try {
      const query = req.query.query as string;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        // Return a mock result for demonstration when API Key is absent
        return res.json({
          results: [
            {
              id: 999999,
              title: query || "Mock Movie Search Result",
              overview: "This mock result is returned because TMDB_API_KEY was not configured in the host environment.",
              poster_path: null,
              backdrop_path: null,
              vote_average: 7.2,
              release_date: "2024-01-01",
            }
          ]
        });
      }

      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${tmdbKey}&include_adult=true&language=en-US`);
          if (response.ok) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: `Failed to fetch TMDB search: ${response?.statusText}` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Search Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB", details: e.message });
    }
  });


  // API Route for TMDB Find (IMDB ID)
  app.get("/api/meta-data/find/:id", async (req, res) => {
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
          response = await fetch(`https://api.themoviedb.org/3/find/${externalId}?external_source=imdb_id&api_key=${tmdbKey}&language=en-US`);
          if (response.ok) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: `Failed to fetch TMDB find: ${response?.statusText}` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Find Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB find", details: e.message });
    }
  });


  // API Route for TMDB Season Details
  app.get("/api/meta-data/season/:id/:seasonNumber", async (req, res) => {
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
          response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${tmdbKey}&language=en-US`);
          if (response.ok) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: `Failed to fetch TMDB season: ${response?.statusText}` });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Season Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB season", details: e.message });
    }
  });

  app.get("/api/meta-data/person/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        return res.json({ profile_path: null });
      }

      const response = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${tmdbKey}&language=en-US`);
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

  // API Route for TMDB Details (videos and genres)
  app.get("/api/meta-data/details/:id", async (req, res) => {
    try {
      const tmdbId = req.params.id;
      const type = req.query.type === 'tv' ? 'tv' : 'movie';
      const tmdbKey = process.env.TMDB_API_KEY;
      
      if (!tmdbKey) {
        // Provide a mock successful object for demonstration purposes
        return res.json({
          id: parseInt(tmdbId),
          title: "Mock Movie (No API Key)",
          overview: "This is a dummy synopsis because no TMDB_API_KEY was provided.",
          poster_path: null,
          backdrop_path: null,
          vote_average: 8.5,
          release_date: "2024-01-01",
          genres: [{ name: "Action" }, { name: "Thriller" }],
          videos: {
             results: [
                { type: "Trailer", site: "YouTube", key: "dQw4w9WgXcQ" }
             ]
          },
          credits: {
             cast: [
                { name: "John Doe" },
                { name: "Jane Smith" },
                { name: "Alex Johnson" }
             ]
          }
        });
      }

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?append_to_response=credits,videos,images&api_key=${tmdbKey}&language=en-US`);
          if (response.ok || response.status === 404) break;
        } catch (err) {
          if (retries === 1) throw err;
        }
        retries--;
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (!response || !response.ok) {
         return res.status(response?.status || 500).json({ error: `Failed to fetch TMDB details for ${type}: ${response?.statusText}` });
      }
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("TMDB Details Error:", e.message);
      res.status(500).json({ error: "Failed to fetch from TMDB details", details: e.message });
    }
  });

  // API Route for Trending Videos via RapidAPI
  app.get("/api/trending-videos", async (req, res) => {
    try {
      const rapidApiKey = process.env.RAPIDAPI_KEY;
      const rapidApiHost = process.env.RAPIDAPI_HOST;
      const rapidApiUrl = process.env.RAPIDAPI_URL;

      if (!rapidApiKey || !rapidApiHost || !rapidApiUrl) {
        // Return mock data if not configured
        return res.json({
          videos: [
            { title: "Deadpool & Wolverine | Official Trailer", embed_url: "https://www.youtube.com/embed/73_1biuggHI" },
            { title: "Dune: Part Two | Official Trailer", embed_url: "https://www.youtube.com/embed/Way9Dexny3w" },
            { title: "Spider-Man: Across the Spider-Verse", embed_url: "https://www.youtube.com/embed/shW9i6k8cB0" },
            { title: "Avatar: The Way of Water | Official Trailer", embed_url: "https://www.youtube.com/embed/d9MyW72ELq0" },
            { title: "Oppenheimer | New Trailer", embed_url: "https://www.youtube.com/embed/uYPbbksJxIg" },
            { title: "The Batman - Main Trailer", embed_url: "https://www.youtube.com/embed/mqqft2x_Aa4" },
            { title: "Kalki 2898 AD - Trailer", embed_url: "https://www.youtube.com/embed/kQGAAhEq0tE" },
            { title: "Salaar: Part 1 - Ceasefire", embed_url: "https://www.youtube.com/embed/4urhQYw3PGE" }
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

  // PHUB Trending API Proxy
  app.get("/api/phub-trending", async (req, res) => {
    try {
      const response = await fetch('https://pornhub-api-xnxx.p.rapidapi.com/api/trending?page=1', {
        headers: {
          'x-rapidapi-host': 'pornhub-api-xnxx.p.rapidapi.com',
          'x-rapidapi-key': '8ec1489348msh9f97ee5a9a78f85p1c5eafjsnd6b122f32963'
        }
      });
      let data = [];
      if (response.ok) {
        data = await response.json();
      }
      
      // If API returns empty array or fails, provide some fallback live hub content
      if (!Array.isArray(data) || data.length === 0) {
         data = [
           {
             title: "Hot Desi Bhabhi Romance Latest",
             embed_url: "https://www.eporner.com/embed/gL5Xk5Z1U3B/",
             thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80"
           },
           {
             title: "College Girl Web Series Trending",
             embed_url: "https://www.eporner.com/embed/xyz123/",
             thumbnail: "https://images.unsplash.com/photo-1512413914592-3c252cb7ec18?w=400&q=80"
           },
           {
             title: "Seductive Midnight Stories",
             embed_url: "https://www.eporner.com/embed/abc456/",
             thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
           },
           {
             title: "Office Secretary Special Episode",
             embed_url: "https://www.eporner.com/embed/def789/",
             thumbnail: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80"
           }
         ];
      }
      
      res.json({ videos: data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/proxy/download", async (req, res) => {
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
                     targetUrl += `&confirm=${tokenMatch[1]}`;
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
               targetUrl = `${targetUrl}&confirm=${match[1]}`;
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
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp4"`);
      
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

  app.get("/api/proxy/video", async (req, res) => {
    try {
      const videoUrl = req.query.url as string;
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

      if (req.headers.range) {
        headers["Range"] = req.headers.range;
      }

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
                     targetUrl += `&confirm=${tokenMatch[1]}`;
                  }
               }
            }
            
            redirectCount++;
            continue;
          }
        } else if (response.status === 200 && (targetUrl.includes('drive.google.com') || targetUrl.includes('drive.usercontent.google.com')) && response.headers.get('content-type')?.includes('text/html')) {
           // We might have hit the virus scan warning page directly
           const html = await response.text();
           const match = html.match(/confirm=([a-zA-Z0-9-_]+)/);
           if (match) {
               targetUrl = `${targetUrl}&confirm=${match[1]}`;
               redirectCount++;
               continue;
           }
           // Fallback to sending the HTML
           res.setHeader('Content-Type', 'text/html');
           return res.status(200).send(html);
        }
        break;
      }

      if (!response) {
         return res.status(500).send("Failed to fetch");
      }
      
      // Copy response headers
      response.headers.forEach((value, key) => {
        // Exclude specific headers that might cause issues
        if (key.toLowerCase() !== 'content-disposition' && key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'content-encoding') {
          if (key.toLowerCase() === 'content-type') {
             if (value.includes('matroska')) {
                res.setHeader(key, 'video/webm');
             } else if (value.includes('octet-stream')) {
                res.setHeader(key, 'video/mp4');
             } else {
                res.setHeader(key, value);
             }
          } else {
             res.setHeader(key, value);
          }
        }
      });
      res.status(response.status);

      if (response.body) {
        Readable.fromWeb(response.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (e: any) {
      console.error("Video Proxy Error:", e.message);
      res.status(500).end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
