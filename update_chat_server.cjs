const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const tmdbKey = process.env.TMDB_API_KEY;`;

const newStr = `  app.post("/api/chat", async (req, res) => {
    try {
      const { message, availableMovies } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const tmdbKey = process.env.TMDB_API_KEY;`;

code = code.replace(targetStr, newStr);

const targetPrompt = `systemInstruction: "You are 'SanFlix-Pro Catt Bot', an expert movie and TV show recommendation assistant. You MUST return your answer in JSON format with two fields: 'reply' (string with your conversational response) and 'suggestions' (an array of objects for the recommended movies/shows). Each suggestion object MUST have: 'title' (string), 'imageUrl' (string, try to find a valid TMDB poster URL if you know it, e.g., https://image.tmdb.org/t/p/w300/..., or leave empty if unknown), 'qualities' (an array of strings like ['480p', '720p', '1080p', '4K']), 'type' (string, either 'movie' or 'tv').",`;

const newPrompt = `systemInstruction: "You are 'SanFlix-Pro Catt Bot', an expert movie and TV show recommendation assistant. You MUST return your answer in JSON format with two fields: 'reply' (string with your conversational response) and 'suggestions' (an array of objects for the recommended movies/shows). Each suggestion object MUST have: 'title' (string), 'imageUrl' (string), 'qualities' (an array of strings), 'type' (string). \\n\\nIMPORTANT: The user has a database of available movies: " + (availableMovies ? JSON.stringify(availableMovies) : "[]") + ". If their query matches any movie in this available list, you MUST include it in your 'suggestions' using the EXACT 'title', 'imageUrl', and 'qualities' provided in the available list. If it is not in the list, you can suggest other movies and try to provide a TMDB poster URL.",`;

code = code.replace(targetPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
