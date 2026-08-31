const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetNetworks = `  const defaultNetworks = [
    { id: 'n1', name: 'NETFLIX', colorClass: 'bg-red-600' },
    { id: 'n2', name: 'PRIME VIDEO', colorClass: 'bg-sky-500' },
    { id: 'n3', name: 'ALTBALAJI', colorClass: 'bg-orange-500' },
    { id: 'n4', name: 'SONYLIV', colorClass: 'bg-indigo-700' },
    { id: 'n5', name: 'MX PLAYER', colorClass: 'bg-blue-600' },
  ];
  const adultNetworks = [
    { id: 'v1', name: 'ULLU VIP', colorClass: 'bg-pink-600' },
    { id: 'v2', name: 'KOOKU', colorClass: 'bg-purple-600' },
    { id: 'v3', name: 'PRIMESHOTS', colorClass: 'bg-rose-500' },
  ];`;

const newNetworks = `  const defaultNetworks = [
    { id: 'n1', name: 'NETFLIX', colorClass: 'from-red-600 to-red-900 border-red-500/30', textClass: 'text-red-50 font-black tracking-[0.2em] uppercase text-xl drop-shadow-md', label: 'NETFLIX', initial: 'N' },
    { id: 'n2', name: 'PRIME VIDEO', colorClass: 'from-cyan-500 to-blue-700 border-blue-400/30', textClass: 'text-blue-50 font-extrabold tracking-wide text-lg', label: 'prime video', initial: 'P' },
    { id: 'n3', name: 'ALTBALAJI', colorClass: 'from-orange-500 to-red-600 border-orange-400/30', textClass: 'text-orange-50 font-bold tracking-tight text-lg', label: 'ALTBalaji', initial: 'A' },
    { id: 'n4', name: 'SONYLIV', colorClass: 'from-indigo-600 to-purple-800 border-indigo-400/30', textClass: 'text-indigo-50 font-black tracking-tighter text-lg', label: 'SonyLIV', initial: 'S' },
    { id: 'n5', name: 'MX PLAYER', colorClass: 'from-blue-600 to-blue-900 border-blue-500/30', textClass: 'text-blue-50 font-black tracking-normal text-lg', label: 'MX PLAYER', initial: 'M' },
  ];
  const adultNetworks = [
    { id: 'v1', name: 'ULLU VIP', colorClass: 'from-pink-500 to-rose-700 border-pink-400/30', textClass: 'text-pink-50 font-black tracking-wider text-lg', label: 'ULLU VIP', initial: 'U' },
    { id: 'v2', name: 'KOOKU', colorClass: 'from-purple-600 to-fuchsia-800 border-purple-400/30', textClass: 'text-purple-50 font-bold tracking-widest text-lg', label: 'KOOKU', initial: 'K' },
    { id: 'v3', name: 'PRIMESHOTS', colorClass: 'from-rose-500 to-red-700 border-rose-400/30', textClass: 'text-rose-50 font-extrabold italic text-lg', label: 'PRIMESHOTS', initial: 'P' },
  ];`;

code = code.replace(targetNetworks, newNetworks);

const targetRender = `                    <div className="flex overflow-x-auto gap-3 hide-scrollbar px-4 pb-2">
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => setSelectedCategory(network.name)}
                          className={\`shrink-0 w-32 h-14 rounded-xl flex items-center justify-center font-black tracking-wider text-sm shadow-lg \${network.colorClass} border border-white/10 hover:brightness-110 transition-all\`}
                        >
                          {network.name}
                        </button>
                      ))}
                    </div>`;

const newRender = `                    <div className="flex overflow-x-auto gap-3 hide-scrollbar px-4 pb-2">
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => setSelectedCategory(network.name)}
                          className={\`group relative shrink-0 w-36 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg bg-gradient-to-br \${network.colorClass} border hover:brightness-110 hover:scale-105 transition-all overflow-hidden\`}
                        >
                          <div className="absolute -right-2 -bottom-4 opacity-[0.15] text-[60px] font-black italic transform -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
                             {network.initial}
                          </div>
                          <span className={\`\${network.textClass} relative z-10 drop-shadow-md\`}>
                            {network.label}
                          </span>
                        </button>
                      ))}
                    </div>`;

code = code.replace(targetRender, newRender);

fs.writeFileSync('src/App.tsx', code);
