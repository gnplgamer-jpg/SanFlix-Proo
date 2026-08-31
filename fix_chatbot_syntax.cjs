const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

code = code.replace(
  /finalReply \+\= "\n\nवैसे भाई, क्या आपको gaming phone lene के लिए सस्ते में डायमंड्स चाहिए\? हमारे \[Sanjay Shop\]\(#shop\) पर क्लिक करें!";/,
  "finalReply += '\\n\\nवैसे भाई, क्या आपको gaming phone lene के लिए सस्ते में डायमंड्स चाहिए? हमारे [Sanjay Shop](#shop) पर क्लिक करें!';"
);

fs.writeFileSync('src/components/ChatBot.tsx', code);
