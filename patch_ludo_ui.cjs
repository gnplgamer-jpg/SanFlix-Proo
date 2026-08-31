const fs = require('fs');
let content = fs.readFileSync('src/components/LudoGame.tsx', 'utf8');

// Add a glowing effect to the tokens and dice
content = content.replace(
  /className=\{`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer \$\{p === -1 \? 'bg-red-500' : 'bg-zinc-800 opacity-20'\}`\}/g,
  `className={\`w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform \${p === -1 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-zinc-800 opacity-20 shadow-none'}\`}`
);

content = content.replace(
  /className=\{`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer \$\{p === -1 \? 'bg-green-500' : 'bg-zinc-800 opacity-20'\}`\}/g,
  `className={\`w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform \${p === -1 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-zinc-800 opacity-20 shadow-none'}\`}`
);

content = content.replace(
  /className=\{`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer \$\{p === -1 \? 'bg-blue-500' : 'bg-zinc-800 opacity-20'\}`\}/g,
  `className={\`w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform \${p === -1 ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-zinc-800 opacity-20 shadow-none'}\`}`
);

content = content.replace(
  /className=\{`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer \$\{p === -1 \? 'bg-yellow-500' : 'bg-zinc-800 opacity-20'\}`\}/g,
  `className={\`w-8 h-8 rounded-full border-2 border-white shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform \${p === -1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 'bg-zinc-800 opacity-20 shadow-none'}\`}`
);

fs.writeFileSync('src/components/LudoGame.tsx', content);
