const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

const replacement = `{/* Persistent Search Bar */}
      <div className="px-4 pt-4 bg-zinc-950 border-b border-zinc-900 sticky top-[auto] z-30">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search live channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
          />
        </div>

        {/* 2. Middle Section: Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`snap-center whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all \${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Section: Channel List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-500" />
            <p className="font-bold">Scanning satellites for channels...</p>
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Tv className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-white">No channels found</p>
            <p className="text-sm">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => {
                  setCurrentChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={\`flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group \${
                  currentChannel?.id === channel.id 
                    ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800'
                }\`}
              >
                <div className="relative shrink-0">
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
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <h3 className={\`font-bold truncate \${currentChannel?.id === channel.id ? 'text-red-500' : 'text-zinc-200 group-hover:text-white'}\`}>
                    {channel.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium truncate">{channel.category}</p>
                </div>
                
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
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;

const splitIndex = code.indexOf("{/* Persistent Search Bar */}");
if (splitIndex !== -1) {
  code = code.substring(0, splitIndex) + replacement;
}
fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed syntax of LiveTvScreen.tsx');
