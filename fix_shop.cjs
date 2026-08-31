const fs = require('fs');
let code = fs.readFileSync('src/components/Shop.tsx', 'utf-8');

const targetStr = `      <div className="p-4">
        {loading ? (`;

const newStr = `      <div className="px-4 py-3 border-b border-white/5 overflow-x-auto hide-scrollbar whitespace-nowrap bg-zinc-950 sticky top-[72px] z-30">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-4 py-1.5 rounded-full text-xs font-bold transition-colors \${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/Shop.tsx', code);
