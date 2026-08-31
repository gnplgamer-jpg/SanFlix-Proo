const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const importGenAI = `import { GoogleGenAI } from "@google/genai";\n`;
if (!code.includes('@google/genai')) {
   code = code.replace('import express from "express";', 'import express from "express";\n' + importGenAI);
}

const aiEndpoint = `
  app.post("/api/chat", async (req, res) => {
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
  });

  // API Route for TMDB Searching`;

code = code.replace("  // API Route for TMDB Searching", aiEndpoint);

fs.writeFileSync('server.ts', code);
