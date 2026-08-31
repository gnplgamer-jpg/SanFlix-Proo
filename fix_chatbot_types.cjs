const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const targetType = `interface MovieSuggestion {
  title: string;
  imageUrl?: string;
  qualities?: string[];
  type?: string;
}`;
const newType = `interface MovieSuggestion {
  title: string;
  imageUrl?: string;
  qualities?: string[];
  type?: string;
  id?: string;
}`;
code = code.replace(targetType, newType);
fs.writeFileSync('src/components/ChatBot.tsx', code);
