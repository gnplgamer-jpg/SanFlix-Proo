const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
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
          systemInstruction: "You are 'SanFlix-Pro Catt Bot', a friendly, enthusiastic, and expert movie/TV-show recommendation AI assistant. Your primary task is to identify movies or TV shows based on the user's hints, plot descriptions, YouTube links, or poster URLs. When you identify the movie, **bold** its title. Keep your answers concise, use emojis, and suggest similar movies if appropriate.",
        }
      });

      res.json({ reply: response.text });
    } catch (e) {
      console.error("AI Chat Error:", e.message || e);
      res.status(500).json({ error: "Failed to generate AI response", details: e.message || e.toString() });
    }
  });`;

const newStr = `  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
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
          systemInstruction: "You are 'SanFlix-Pro Catt Bot', an expert movie and TV show recommendation assistant. You MUST return your answer in JSON format with two fields: 'reply' (string with your conversational response) and 'suggestions' (an array of objects for the recommended movies/shows). Each suggestion object MUST have: 'title' (string), 'imageUrl' (string, try to find a valid TMDB poster URL if you know it, e.g., https://image.tmdb.org/t/p/w300/..., or leave empty if unknown), 'qualities' (an array of strings like ['480p', '720p', '1080p', '4K']), 'type' (string, either 'movie' or 'tv').",
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
                  const tmdbRes = await fetch(\`https://api.themoviedb.org/3/search/\${sug.type === 'tv' ? 'tv' : 'movie'}?api_key=\${tmdbKey}&query=\${encodeURIComponent(sug.title)}\`);
                  const tmdbData = await tmdbRes.json();
                  if (tmdbData.results && tmdbData.results.length > 0 && tmdbData.results[0].poster_path) {
                     sug.imageUrl = \`https://image.tmdb.org/t/p/w300\${tmdbData.results[0].poster_path}\`;
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
  });`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('server.ts', code);
