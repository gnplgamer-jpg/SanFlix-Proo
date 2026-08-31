const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf-8');

const targetStr = `                          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-[180px] group cursor-pointer hover:border-red-500/50 transition-colors">`;

const newStr = `                          <div key={idx} onClick={() => alert("Movie details selected: " + sug.title + " (Play feature not direct)")} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-[180px] group cursor-pointer hover:border-red-500/50 transition-colors">`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/ChatBot.tsx', code);
