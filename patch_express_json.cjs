const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace('app.use(express.json());', 'app.use(express.json({ limit: "10mb" }));');

const verifyRoute = `
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { image } = req.body; // base64 string
      if (!image) return res.status(400).json({ error: "Missing image" });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "No API key" });

      const ai = new GoogleGenAI({ apiKey });
      
      // Strip data URI prefix if present
      const base64Data = image.replace(/^data:image\\/\\w+;base64,/, "");

      const prompt = \`Analyze this payment slip for an eSewa transaction. 
      Is it a valid, authentic payment receipt? Does it look like a real transaction screenshot, or does it look fake, edited, manipulated, or completely unrelated to a payment?
      Return a JSON object exactly like this:
      {"valid": true_or_false, "reason": "short explanation"}\`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const text = response.text();
      let result;
      try {
         result = JSON.parse(text);
      } catch(e) {
         return res.json({ valid: false, reason: "Verification failed to parse." });
      }

      res.json(result);
    } catch (e: any) {
      console.error("AI Verification Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });
`;

code = code.replace('app.get("/api/proxy/video",', verifyRoute + '\\n  app.get("/api/proxy/video",');
fs.writeFileSync('server.ts', code);
