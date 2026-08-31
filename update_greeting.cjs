const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const targetGreeting = `content: "Hi there! I'm **SanFlix-Pro Catt Bot** 😸. Don't know the name of a movie? Just paste a YouTube link, Google link, poster URL, or describe the plot, and I'll help you find it! 🍿✨"`;
const newGreeting = `content: "Hi there! I'm **SanFlix-Pro Catt Bot** 😸. I am your exclusive SanFlix-Pro assistant. Don't know the name of a movie? Just paste a YouTube link, Google link, poster URL, or describe the plot, and I'll help you find it in our catalog! 🍿✨"`;

code = code.replace(targetGreeting, newGreeting);
fs.writeFileSync('src/components/ChatBot.tsx', code);
