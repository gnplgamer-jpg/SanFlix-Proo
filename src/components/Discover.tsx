import { BlurImage } from './BlurImage';
import { TrendingUp, Play, Star, Clock } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react';

const categoriesDB = [
// ... (same as before)
  {
      section: "MOVIES CATEGORIES",
      id: "section-1",
      items: [
          { title: "Drama & Romance", bgClass: "from-blue-600/20 to-cyan-600/5", icon: "fa-masks-theater", keywords: ["drama", "romance", "romantic", "love", "love story", "emotional"] },
          { title: "Action & Thriller", bgClass: "from-amber-600/20 to-orange-600/5", icon: "fa-burst", keywords: ["action", "thriller", "suspense", "fight"] },
          { title: "Sci-Fi & Fantasy", bgClass: "from-indigo-600/20 to-purple-600/5", icon: "fa-shuttle-space", keywords: ["scifi", "sci-fi", "fantasy", "space", "magic"] },
          { title: "Horror & Mystery", bgClass: "from-zinc-700/40 to-zinc-900/10", icon: "fa-ghost", keywords: ["horror", "mystery", "scary", "ghost", "horror zone"] },
          { title: "Comedy & Family", bgClass: "from-emerald-600/20 to-teal-600/5", icon: "fa-face-laugh-squint", keywords: ["comedy", "family", "funny", "laugh"] },
          { title: "Anime & Animation", bgClass: "from-purple-600/20 to-fuchsia-600/5", icon: "fa-pencil", keywords: ["anime", "animation", "cartoon", "manga"] },
          { title: "Historical & Epic", bgClass: "from-yellow-700/20 to-amber-900/5", icon: "fa-scroll", keywords: ["historical", "epic", "history", "ancient"] }
      ]
  },
  {
      section: "WEB SERIES CATEGORIES",
      id: "section-2",
      items: [
          { title: "Binge-Thriller", bgClass: "from-teal-600/20 to-cyan-900/5", icon: "fa-user-secret", keywords: ["binge", "thriller", "series", "web"] },
          { title: "Workplace Comedy", bgClass: "from-lime-600/20 to-emerald-900/5", icon: "fa-building", keywords: ["workplace", "comedy", "office", "funny"] },
          { title: "Anthology Series", bgClass: "from-fuchsia-600/20 to-pink-950/5", icon: "fa-layer-group", keywords: ["anthology", "series", "collection"] },
          { title: "Limited Series", bgClass: "from-sky-600/20 to-indigo-950/5", icon: "fa-calendar-check", keywords: ["limited", "series", "short"] },
          { title: "Cyberpunk/Dystopian", bgClass: "from-violet-600/20 to-purple-950/5", icon: "fa-robot", keywords: ["cyberpunk", "dystopian", "future", "sci-fi"] },
          { title: "Teen / YA Drama", bgClass: "from-pink-600/20 to-rose-950/5", icon: "fa-graduation-cap", keywords: ["teen", "young", "adult", "drama", "ya"] }
      ]
  },
  {
      section: "ADULT / MATURE (18+) EXCLUSIVES",
      id: "section-3",
      items: [
          { title: "Erotic Thriller", bgClass: "from-red-950/80 to-red-900/20", icon: "fa-fire-flame-curved", extraClass: "shadow-[0_0_15px_rgba(220,38,38,0.4)]", keywords: ["erotic", "thriller", "hot", "18+", "mature"] },
          { title: "Gore & Splatter", bgClass: "from-red-900/40 to-zinc-950", icon: "fa-droplet", keywords: ["gore", "splatter", "blood", "horror", "18+"] },
          { title: "Neo-Noir / Edgy", bgClass: "from-neutral-800 to-zinc-950", icon: "fa-eye-slash", keywords: ["neo-noir", "edgy", "dark", "mystery"] },
          { title: "Dark Romance", bgClass: "from-rose-950/70 to-zinc-900", icon: "fa-heart-broken", keywords: ["dark", "romance", "forbidden", "love"] },
          { title: "Forbidden Melodrama", bgClass: "from-purple-950/60 to-neutral-900", icon: "fa-door-closed", keywords: ["forbidden", "melodrama", "drama", "18+"] },
          { title: "ULLU Originals", bgClass: "from-yellow-600/20 to-amber-600/5", icon: "fa-crown", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["ullu", "originals", "hot", "desi", "web series"] },
          { title: "KOOKU Premium", bgClass: "from-amber-600/20 to-yellow-600/5", icon: "fa-star", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["kooku", "premium", "hot", "desi"] },
          { title: "PRIMESHOTS App", bgClass: "from-blue-900/40 to-blue-950", icon: "fa-video", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["primeshots", "app", "hot", "desi"] },
          { title: "CHULLTV Network", bgClass: "from-orange-600/20 to-orange-950/5", icon: "fa-bolt", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["chulltv", "network", "hot", "desi"] },
          { title: "HOTX VIP", bgClass: "from-purple-600/20 to-purple-950/5", icon: "fa-gem", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["hotx", "vip", "hot", "desi"] },
          { title: "DESIFLIX Streaming", bgClass: "from-red-800/40 to-red-950", icon: "fa-play", extraClass: "shadow-[0_0_15px_rgba(217,119,6,0.4)]", keywords: ["desiflix", "streaming", "hot", "desi", "viral"] },
          { title: "Hot Web Series", bgClass: "from-rose-800/30 to-zinc-900", icon: "fa-wand-magic-sparkles", extraClass: "shadow-[0_0_15px_rgba(220,38,38,0.4)]", keywords: ["hot", "web series", "desi", "18+"] },
          { title: "MMS Viral Video", bgClass: "from-red-950 to-black", icon: "fa-clapperboard", extraClass: "shadow-[0_0_15px_rgba(220,38,38,0.4)]", keywords: ["mms", "viral", "video", "hot", "leaked"] },
          { title: "Short Films Hub", bgClass: "from-cyan-900/30 to-zinc-900", icon: "fa-film", keywords: ["short", "films", "hub", "indie"] }
      ]
  }
];

const safeLower = (val: any) => String(val || undefined).toLowerCase();


const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, setTimeLeft] = React.useState(expiryTime - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expiryTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft <= 0) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg border border-red-400/50 flex items-center gap-1 z-20">
      <Clock className="w-3 h-3 animate-pulse" />
      {hours}h {minutes}m {seconds}s
    </div>
  );
};

export function Discover({ content = [], onSelectMovie, unlockedContent = {} }: { content?: any[], onSelectMovie?: (movie: any) => void, unlockedContent?: Record<string, number> }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Catalog');
  const [searchHistory, setSearchHistory] = useState([
    "ULLU", "Hot Web Series", "Action", "MMS Viral", "DesiFlix"
  ]);
  
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Global Trending');
  const [displayedVideos, setDisplayedVideos] = useState<any[]>([]);
  const relatedSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (content.length > 0 && displayedVideos.length === 0 && selectedCategoryName === 'Global Trending') {
        const defaultTrending = [...content].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
        setDisplayedVideos(defaultTrending);
     }
  }, [content]);

  const loadRelatedContent = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    
    // Find category info to get keywords
    const categoryInfo = categoriesDB.flatMap(section => section.items).find(item => item.title === categoryName);
    const keywords = categoryInfo ? categoryInfo.keywords : [safeLower(categoryName)];
    
    // Filter real content based on keywords match with mapped_category_rail or title
    const matches = content.filter(item => {
        const itemCat = safeLower(item.mapped_category_rail);
        const itemTitle = safeLower(item.title);
        return keywords.some((kw: string) => itemCat.includes(safeLower(kw)) || itemTitle.includes(safeLower(kw)));
    });
    
    if (matches.length === 0 && categoryName) {
        // Fallback fuzzy match
        const searchWord = safeLower(categoryName.split(' ')[0]);
        const fuzzyMatches = content.filter(item => {
             return safeLower(item.mapped_category_rail).includes(searchWord) || safeLower(item.title).includes(searchWord);
        });
        setDisplayedVideos(fuzzyMatches);
    } else {
        setDisplayedVideos(matches);
    }

    // Smooth auto-scroll
    setTimeout(() => {
      if (relatedSectionRef.current) {
        relatedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = searchQuery.trim();
      if (term) {
        setSearchHistory(prev => {
          const newHistory = prev.filter(t => t !== term);
          newHistory.unshift(term);
          return newHistory.slice(0, 8);
        });
      }
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const applySearch = (term: string) => {
    setSearchQuery(term);
    setSearchHistory(prev => {
      const newHistory = prev.filter(t => t !== term);
      newHistory.unshift(term);
      return newHistory.slice(0, 8);
    });
  };

  const filteredData = useMemo(() => {
    const q = safeLower(searchQuery).trim();
    if (!q) {
        if (activeFilter === 'Movies') return [categoriesDB[0]];
        if (activeFilter === 'Web Series') return [categoriesDB[1]];
        if (activeFilter === 'Mature 18+') return [categoriesDB[2]];
        return categoriesDB;
    }
    
    return categoriesDB.map(section => {
      return {
        ...section,
        items: section.items.filter(item => 
          safeLower(item.title).includes(q) || 
          item.keywords.some(kw => safeLower(kw).includes(q))
        )
      };
    }).filter(section => section.items.length > 0);
  }, [searchQuery, activeFilter]);

  const contentResults = useMemo(() => {
    const q = safeLower(searchQuery).trim();
    if (!q && activeFilter === 'All Catalog') return [];
    
    let results = content;

    // Filter by Active Tab
    results = results.filter(item => {
      const isMovie = safeLower(item.media_layout_format).includes('movie');
      const isSeries = safeLower(item.media_layout_format).includes('show') || safeLower(item.media_layout_format).includes('series');
      const isMature = safeLower(item.mapped_category_rail).includes('18+') || safeLower(item.mapped_category_rail).includes('hot');

      if (activeFilter === 'Movies' && !isMovie) return false;
      if (activeFilter === 'Web Series' && !isSeries) return false;
      if (activeFilter === 'Mature 18+' && !isMature) return false;
      
      return true;
    });

    if (q) {
        // Realtime Content Matching Engine
        const queryTerms = q.split(/[\s&,\-]+/).filter(term => term.trim().length > 0);
        
        results = results.map(item => {
            let score = 0;
            const title = safeLower(item.title);
            const cat = safeLower(item.mapped_category_rail);
            const cast = safeLower(item.cast_crew);
            const desc = safeLower(item.description);
            
            // Exact match bonuses
            if (title === q) score += 100;
            else if (title.includes(q)) score += 50;
            if (cat.includes(q)) score += 40;
            
            // Token-based matching
            queryTerms.forEach(term => {
               if (title.includes(term)) score += 10;
               if (cat.includes(term)) score += 15;
               if (cast.includes(term)) score += 5;
               if (desc.includes(term)) score += 2;
               
               // Specific logic for common category synonyms
               if ((term === 'romance' || term === 'romantic') && cat.includes('roman')) score += 15;
               if ((term === 'sci-fi' || term === 'scifi') && (cat.includes('sci') || cat.includes('scifi'))) score += 15;
               if (term === 'comedy' && cat.includes('comed')) score += 15;
               if (term === 'show' && safeLower(item.media_layout_format).includes('show')) score += 10;
               if (term === 'series' && safeLower(item.media_layout_format).includes('series')) score += 10;
               if (term === 'film' && safeLower(item.media_layout_format).includes('movie')) score += 10;
            });
            
            return { ...item, matchScore: score };
        }).filter(item => item.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
    }
    
    return results;
  }, [searchQuery, content, activeFilter]);

  return (
    <div className="bg-[#09090B] text-white min-h-screen select-none font-sans pb-24">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#09090B]/95 border-b border-zinc-800/50 px-4 py-4">
          <div className="flex items-center gap-3">
              <div className="flex-1 relative border border-transparent">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></i>
                  <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search movies, series, networks, 18+..." 
                      className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-full py-3.5 pl-11 pr-4 outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500"
                  />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-12 h-12 shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                  <i className="fa-solid fa-sliders text-lg"></i>
              </button>
          </div>

          {showFilters && (
            <div className="mt-4 overflow-x-auto hide-scrollbar pb-1 flex items-center gap-2">
                <button onClick={() => setActiveFilter('All Catalog')} className={`px-5 py-2 rounded-full ${activeFilter === 'All Catalog' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'} text-xs font-bold shrink-0 transition-colors`}>All Catalog</button>
                <button onClick={() => setActiveFilter('Movies')} className={`px-5 py-2 rounded-full ${activeFilter === 'Movies' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'} text-xs font-bold shrink-0 transition-colors`}>Movies</button>
                <button onClick={() => setActiveFilter('Web Series')} className={`px-5 py-2 rounded-full ${activeFilter === 'Web Series' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'} text-xs font-bold shrink-0 transition-colors`}>Web Series</button>
                <button onClick={() => setActiveFilter('Mature 18+')} className={`px-5 py-2 rounded-full ${activeFilter === 'Mature 18+' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-red-950/40 border border-red-900/50 text-red-500 hover:bg-red-900/40'} text-xs font-bold shrink-0 transition-colors`}>Mature 18+</button>
            </div>
          )}
      </header>

      <main className="px-4 py-6 max-w-3xl mx-auto space-y-8">
          {searchHistory.length > 0 && searchQuery.trim() === '' && (
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-wider">Recent Discoveries</h2>
                    <button onClick={clearHistory} className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider">Clear</button>
                </div>
                <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-2">
                    {searchHistory.map((term, i) => (
                      <button 
                        key={i}
                        onClick={() => applySearch(term)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors shrink-0 whitespace-nowrap"
                      >
                          <i className="fa-solid fa-clock-rotate-left mr-2 text-zinc-500"></i> {term}
                      </button>
                    ))}
                </div>
            </section>
          )}

          <div className="space-y-8">
            {searchQuery.trim() !== '' ? (
               contentResults.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {contentResults.slice(0, 50).map((movie, index) => (
                      <div 
                        key={`${movie.id || movie.firebase_id || 'movie'}-${index}`}
                        onClick={() => onSelectMovie && onSelectMovie(movie)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                          <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
            <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
          )}
                        </div>
                        <h3 className="text-sm font-medium leading-tight line-clamp-1">{movie.title}</h3>
                        <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                      </div>
                   ))}
                 </div>
               ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <i className="fa-solid fa-magnifying-glass text-2xl text-zinc-500"></i>
                    </div>
                    <h3 className="text-white font-bold mb-2">No results found</h3>
                    <p className="text-zinc-500 text-sm">We couldn't find any content matching "{searchQuery}"</p>
                </div>
               )
            ) : (
              filteredData.length > 0 ? (
                filteredData.map(section => (
                  <section key={section.id}>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">{section.section}</h3>
                      <div className="grid grid-cols-2 gap-3">
                          {section.items.map((item, i) => (
                            <div 
                              key={i}
                              onClick={() => loadRelatedContent(item.title)}
                              className={`h-24 rounded-xl relative overflow-hidden bg-gradient-to-br ${item.bgClass} border border-white/5 p-4 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-transform duration-300 ${item.extraClass || undefined}`}
                            >
                                <i className={`fa-solid ${item.icon} absolute top-3 right-3 text-2xl text-white/20 group-hover:text-white/40 transition-colors`}></i>
                                <h4 className="font-bold text-sm text-white drop-shadow-md z-10 leading-tight">{item.title}</h4>
                            </div>
                          ))}
                      </div>
                  </section>
                ))
              ) : null
            )}
          </div>
          
          {/* YOUTUBE-STYLE DYNAMIC RENDERING LAYER */}
          <div ref={relatedSectionRef} className="pt-10 pb-8 mt-10 border-t border-zinc-800">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-fire text-red-500"></i> 
              Trending in {selectedCategoryName}
            </h2>
            
            {displayedVideos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayedVideos.map((video, index) => (
                  <div key={`${video.id || video.firebase_id || 'video'}-${index}`} className="group cursor-pointer flex flex-col" onClick={() => onSelectMovie && onSelectMovie(video)}>
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50 shadow-md">
                      <BlurImage src={video.poster_url || video.imageUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                {video.rating && parseFloat(video.rating) >= 8.5 && (
                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5">
                     <TrendingUp className="w-2.5 h-2.5" />
                     POPULAR
                   </div>
                )}
                        <div className="bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold border border-white/10">
                          {video.duration_minutes ? `${video.duration_minutes}m` : 'HD'}
                        </div>
                        {((video.episodes && video.episodes.length > 0 && video.episodes[0].url) || video.eps_count > 0) && (
                           <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                             {video.eps_count > 0 ? `${video.eps_count} EPs` : (video.episodes ? `${video.episodes.length} EP${video.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                           </div>
                        )}
                      </div>
                      
                      {/* Play Action Trigger */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.8)] scale-75 group-hover:scale-100 transition-transform">
                            <i className="fa-solid fa-play text-white ml-0.5 text-lg"></i>
                         </div>
                      </div>
                    </div>
                    <div className="px-1 flex-1 flex flex-col justify-start">
                       <h3 className="font-bold text-xs sm:text-sm text-zinc-100 leading-tight mb-1.5 line-clamp-2 group-hover:text-red-400 transition-colors">
                         {video.title}
                       </h3>
                       <div className="text-[10px] sm:text-xs text-zinc-400 flex items-center flex-wrap gap-1">
                         <span className="font-semibold text-red-500 border border-red-500/20 bg-red-500/10 px-1 py-px rounded uppercase text-[9px] line-clamp-1">
                           {video.mapped_category_rail || selectedCategoryName}
                         </span>
                         <span className="hidden sm:inline">•</span>
                         <span className="hidden sm:inline">{video.views || Math.floor(Math.random() * 500) + 10}K views</span>
                         <span className="hidden sm:inline">•</span>
                         <span className="hidden sm:inline">{video.release_date ? String(video.release_date).substring(0, 4) : new Date().getFullYear()}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                      <i className="fa-solid fa-satellite-dish text-2xl text-zinc-500"></i>
                  </div>
                  <h3 className="text-white font-bold mb-2">No active video streams found</h3>
                  <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">No active video streams found for this node. Check back later.</p>
              </div>
            )}
          </div>
      </main>
    </div>
  );
}
