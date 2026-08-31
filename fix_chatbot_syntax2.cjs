const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const oldString = `      if (data.reply || data.suggestions) {
        let finalReply = data.reply || "Here are some suggestions!";
        finalReply += "

वैसे भाई, क्या आपको gaming phone lene के लिए सस्ते में डायमंड्स चाहिए? हमारे [Sanjay Shop](#shop) पर क्लिक करें!";`;

const newString = `      if (data.reply || data.suggestions) {
        let finalReply = data.reply || "Here are some suggestions!";
        finalReply += "\\n\\nवैसे भाई, क्या आपको gaming phone lene के लिए सस्ते में डायमंड्स चाहिए? हमारे [Sanjay Shop](#shop) पर क्लिक करें!";`;

code = code.replace(oldString, newString);

fs.writeFileSync('src/components/ChatBot.tsx', code);
