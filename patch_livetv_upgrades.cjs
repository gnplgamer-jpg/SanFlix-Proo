const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  "import { Play, Tv, Search, AlertCircle, Loader2, SignalHigh, Flame, WifiOff } from 'lucide-react';",
  "import { Play, Tv, Search, AlertCircle, Loader2, SignalHigh, Flame, WifiOff, Heart } from 'lucide-react';"
);

// 2. Add states
const statesToAdd = `
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_LIVETV_FAVORITES');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(channelId) 
        ? prev.filter(id => id !== channelId) 
        : [...prev, channelId];
      localStorage.setItem('SANFLIX_LIVETV_FAVORITES', JSON.stringify(newFavs));
      return newFavs;
    });
  };
`;
code = code.replace(
  "const [playerError, setPlayerError] = useState(false);",
  "const [playerError, setPlayerError] = useState(false);\n" + statesToAdd
);

// 3. Update categories and filteredChannels
code = code.replace(
  "const categories = ['All', 'Hindi Movies', 'Bhojpuri', 'Nepali', 'News'];",
  "const categories = ['All', 'Favorites', 'Hindi Movies', 'Bhojpuri', 'Nepali', 'News'];"
);

const newFilteredChannels = `  const filteredChannels = channels.filter(c => {
    const matchesCategory = activeCategory === 'All' 
      ? true 
      : activeCategory === 'Favorites'
        ? favorites.includes(c.id)
        : c.category === activeCategory;
    
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });`;
code = code.replace(
  /const filteredChannels = activeCategory === 'All'[\s\S]*?channels\.filter\(c => c\.category === activeCategory\);/,
  newFilteredChannels
);

// 4. Add Search bar above Category Tabs
const categoryTabsRegex = /\{\/\* 2\. Middle Section: Category Tabs \*\/\}\s*<div className="px-4 py-4 bg-zinc-950 border-b border-zinc-900 sticky top-\[auto\] z-30">/;
const searchAndCategoryTabs = `{/* Persistent Search Bar */}
      <div className="px-4 pt-4 bg-zinc-950">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search live channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* 2. Middle Section: Category Tabs */}
      <div className="px-4 py-4 bg-zinc-950 border-b border-zinc-900 sticky top-[auto] z-30">`;
code = code.replace(categoryTabsRegex, searchAndCategoryTabs);

// 5. Add LIVE badge to the thumbnail
const oldThumbnailContainer = /<div className="relative">[\s\S]*?<img[\s\S]*?\/>\s*<\/div>/;
const newThumbnailContainer = `<div className="relative">
                  <div className={\`w-14 h-14 rounded-full overflow-hidden bg-white p-1 flex items-center justify-center \${currentChannel?.id === channel.id ? 'ring-2 ring-red-500' : 'ring-1 ring-zinc-700'}\`}>
                    <img 
                      src={channel.logo} 
                      alt={channel.name}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x150/1f2937/ef4444?text=TV')}
                    />
                  </div>
                  {/* LIVE Badge overlay */}
                  <div className="absolute -top-1 -right-2 bg-red-600 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded text-white shadow-sm uppercase border border-red-900/50">
                    LIVE
                  </div>
                </div>`;
code = code.replace(oldThumbnailContainer, newThumbnailContainer);

// 6. Add Heart button
const oldPlayIcon = /<div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">\s*<Play className="w-4 h-4 text-white ml-0\.5" \/>\s*<\/div>/;
const newPlayIconAndHeart = `
                <div className="flex flex-col gap-2 items-center justify-center shrink-0">
                  <button 
                    onClick={(e) => toggleFavorite(e, channel.id)}
                    className={\`w-8 h-8 rounded-full flex items-center justify-center transition-colors \${
                      favorites.includes(channel.id) 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : 'bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700'
                    }\`}
                  >
                    <Heart className={\`w-4 h-4 \${favorites.includes(channel.id) ? 'fill-current' : ''}\`} />
                  </button>
                </div>`;
code = code.replace(oldPlayIcon, newPlayIconAndHeart);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('patched live tv updates');
