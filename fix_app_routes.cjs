const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetRoutes = `        ) : activeTab === 'discover' ? (
          <Discover content={filteredContent} onSelectMovie={handleSelectMovie} />
        ) : activeTab === 'movies' ? (
          <Movies 
            movies={filteredContent.filter(m => safeLower(m.media_layout_format).includes('movie'))}
            onSelect={handleSelectMovie}
          />
        ) : activeTab === 'tvshows' ? (
          <TvShows 
            tvShows={filteredContent.filter(m => safeLower(m.media_layout_format).includes('show') || safeLower(m.media_layout_format).includes('series'))}
            onSelect={handleSelectMovie}
          />
        ) : activeTab === 'mylist' ? (
          <div className="pt-8 pb-32 px-4 min-h-screen">
            <h2 className="text-2xl font-black text-white mb-6 tracking-tight">My List</h2>
            {myListMovies.length === 0 ? (
               <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 font-medium font-sans">Your list is empty.</p>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[200px] mx-auto">Explore movies and TV shows and tap the heart icon to add them to your list.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {myListMovies.map((movie, idx) => (
                   <motion.div
                     layoutId={\`mylist-\${movie.id || movie.firebase_id}-\${idx}\`}
                     key={\`\${movie.id || movie.firebase_id}-\${idx}\`}
                     className="group cursor-pointer"
                     onClick={() => handleSelectMovie(movie)}
                   >
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                       <img
                         src={movie.poster_url || movie.imageUrl}
                         alt={movie.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                         className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors z-10"
                       >
                         <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                       </button>
                       <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                         {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                           <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                             {movie.eps_count > 0 ? \`\${movie.eps_count} EPs\` : (movie.episodes ? \`\${movie.episodes.length} EP\${movie.episodes.length > 1 ? 's' : ''}\` : 'EPs')}
                           </div>
                         )}
                       </div>
                     </div>
                     <h3 className="text-sm font-medium leading-tight line-clamp-1">{movie.title}</h3>
                     <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                   </motion.div>
                 ))}
               </div>
            )}
          </div>`;

const newRoutes = `        ) : activeTab === 'discover' ? (
          <Discover content={filteredContent} onSelectMovie={handleSelectMovie} />
        ) : activeTab === 'explore' ? (
          <div className="pt-8 pb-32 px-4 min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-6">Explore All Movies & Shows</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredContent.map((movie, idx) => (
                   <motion.div
                     key={\`\${movie.id || movie.firebase_id}-\${idx}\`}
                     className="group cursor-pointer"
                     onClick={() => handleSelectMovie(movie)}
                   >
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                       <img
                         src={movie.poster_url || movie.imageUrl}
                         alt={movie.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                     </div>
                     <h3 className="text-sm font-medium leading-tight line-clamp-1 text-white">{movie.title}</h3>
                   </motion.div>
              ))}
            </div>
          </div>
        ) : activeTab === 'shop' ? (
          <Shop />
        ) : activeTab === 'cart' ? (
          <CartScreen />
        ) : activeTab === 'mylist' ? (
          <div className="pt-8 pb-32 min-h-screen flex flex-col">
            <h2 className="text-2xl font-black text-white mb-6 px-4 tracking-tight">My List</h2>
            {myListMovies.length === 0 ? (
               <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 mx-4">
                  <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 font-medium font-sans">Your list is empty.</p>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[200px] mx-auto">Explore movies and TV shows and tap the heart icon to add them to your list.</p>
               </div>
            ) : (
               <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar pb-8">
                 {myListMovies.map((movie, idx) => (
                   <motion.div
                     layoutId={\`mylist-\${movie.id || movie.firebase_id}-\${idx}\`}
                     key={\`\${movie.id || movie.firebase_id}-\${idx}\`}
                     className="group cursor-pointer shrink-0 w-36 sm:w-48"
                     onClick={() => handleSelectMovie(movie)}
                   >
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50 shadow-lg">
                       <img
                         src={movie.poster_url || movie.imageUrl}
                         alt={movie.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                         className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors z-10"
                       >
                         <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                       </button>
                       <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                         {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                           <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                             {movie.eps_count > 0 ? \`\${movie.eps_count} EPs\` : (movie.episodes ? \`\${movie.episodes.length} EP\${movie.episodes.length > 1 ? 's' : ''}\` : 'EPs')}
                           </div>
                         )}
                       </div>
                     </div>
                     <h3 className="text-sm font-medium text-white leading-tight line-clamp-1">{movie.title}</h3>
                     <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                   </motion.div>
                 ))}
               </div>
            )}
          </div>`;

code = code.replace(targetRoutes, newRoutes);
fs.writeFileSync('src/App.tsx', code);
