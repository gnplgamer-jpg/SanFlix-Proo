const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

code = code.replace(
  "Hi there! I'm **SanFlix-Pro Catt Bot** 😸.",
  "Hi there! I'm **SanFlix-Pro Chat Bot** 🤖."
);

code = code.replace(
  "Sanjay Shop",
  "Daraz Shop"
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
