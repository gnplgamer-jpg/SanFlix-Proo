import React, { useState, useEffect, useRef } from 'react';
import { Play, Star, ChevronRight, Heart, Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';


const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

  useEffect(() => {
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

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={shouldLoad ? src : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
      alt={alt}
      className={`${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-500`}
      onLoad={() => { if (shouldLoad) setIsLoaded(true); }}
    />
  );
};

interface MovieRailProps {
  title: string;
  emoji?: string;
  movies: any[];
  onSelectMovie: (movie: any) => void;
  colorClass?: string;
  isTop10?: boolean;
  isComingSoon?: boolean;
  onSeeAll?: () => void;
  onToggleMyList?: (e: React.MouseEvent, movie: any) => void;
  myListIds?: string[];
  unlockedContent?: Record<string, number>;
  continueWatchingIds?: string[];
}

export function MovieRail({ title, emoji, movies, onSelectMovie, colorClass = "border-red-600", isTop10 = false, isComingSoon = false, onSeeAll, onToggleMyList, myListIds = [], continueWatchingIds = [], unlockedContent = {} }: MovieRailProps) {
  const [progressData, setProgressData] = useState<Record<string, { currentTime: number, duration: number }>>({});

  useEffect(() => {
    const loadProgress = () => {
      try {
        const saved = localStorage.getItem('SANFLIX_PROGRESS');
        if (saved) setProgressData(JSON.parse(saved));
      } catch (e) {}
    };
    loadProgress();
    
    const handleProgressUpdate = (e: any) => {
      const { movieId, currentTime, duration } = e.detail;
      setProgressData(prev => ({ ...prev, [movieId]: { currentTime, duration } }));
    };

    window.addEventListener('sanflix_progress_update', handleProgressUpdate);
    return () => window.removeEventListener('sanflix_progress_update', handleProgressUpdate);
  }, []);

  if (!movies || movies.length === 0) return null;

  const getCountdownText = (dateStr: string) => {
    if (!dateStr) return 'Coming Soon';
    try {
      const target = new Date(dateStr);
      const now = new Date();
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) return 'Out Now';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays < 30) return `${diffDays} days`;
      
      return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Coming Soon';
    }
  };

  return (
    <div className="px-0 relative mb-6">
      <div className={`flex items-center justify-between px-4 mb-3 border-l-4 ${colorClass} ml-4 rounded-sm h-4`}>
        <div className="flex items-center gap-2">
          {emoji && <span className="text-lg leading-none">{emoji}</span>}
          <h2 className="text-sm font-bold tracking-wide">{title}</h2>
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
        {movies.map((movie, index) => (
          <div key={`${movie.id || movie.firebase_id || 'movie'}-${index}`} className={`${isTop10 ? 'w-40' : 'w-32'} shrink-0 group cursor-pointer relative`} onClick={() => onSelectMovie(movie)}>
            {isTop10 && (
              <div className="absolute -left-3 bottom-4 text-[80px] font-black leading-none text-[#09090B] drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] z-10 select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>
                {index + 1}
              </div>
            )}
            <div className={`relative ${isTop10 ? 'h-52 ml-6' : 'h-48'} rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50 shadow-lg z-0`}>
              <LazyImage
                src={movie.poster_url || movie.imageUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                {movie.rating && parseFloat(movie.rating) >= 8.5 && (
                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5">
                     <TrendingUp className="w-2.5 h-2.5" />
                     POPULAR
                   </div>
                )}
                <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-white/10">
                  {movie.ad_gate ? (
                    <span className="text-red-500">🔒 VIP</span>
                  ) : (
                    <span className="text-green-400">⚡ HD</span>
                  )}
                </div>
                {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                   <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                     {movie.eps_count > 0 ? `${movie.eps_count} EPs` : (movie.episodes ? `${movie.episodes.length} EP${movie.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                   </div>
                )}
              </div>

              {onToggleMyList && (
                <button 
                  onClick={(e) => onToggleMyList(e, movie)}
                  className="absolute top-2 left-2 p-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors z-10"
                >
                  <Heart className={`w-4 h-4 ${myListIds.includes(movie.id || movie.firebase_id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              )}

              {isComingSoon ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-6 pb-2 px-2 flex flex-col items-center justify-end">
                  <div className="bg-red-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    <Clock className="w-3 h-3" />
                    {getCountdownText(movie.release_date)}
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1 border border-white/10 z-10">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {movie.rating || 'N/A'}
                </div>
              )}
              {continueWatchingIds.includes(movie.id || movie.firebase_id) && progressData[movie.id || movie.firebase_id] && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-10">
                  <div 
                    className="h-full bg-red-600" 
                    style={{ width: `${Math.min(100, Math.max(0, (progressData[movie.id || movie.firebase_id].currentTime / progressData[movie.id || movie.firebase_id].duration) * 100))}%` }} 
                  />
                </div>
              )}
            </div>
            <h3 className={`text-xs font-semibold leading-tight line-clamp-2 group-hover:text-red-400 transition-colors ${isTop10 ? 'ml-6' : ''}`}>
              {movie.title}
            </h3>
          </div>
        ))}
        {/* View More Card */}
        {onSeeAll && (
          <div onClick={onSeeAll} className={`${isTop10 ? 'w-40 h-52 ml-6' : 'w-32 h-48'} shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors`}>
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-zinc-400">View All</span>
          </div>
        )}
      </div>
    </div>
  );
}
