import { BlurImage } from './BlurImage';
import React from 'react';
import { Star, Play, TrendingUp, Clock } from 'lucide-react';

interface MoviesProps {
  unlockedContent?: Record<string, number>;
  movies: any[];
  onSelect: (movie: any) => void;
}


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

export function Movies({ movies, onSelect , unlockedContent = {}}: MoviesProps) {
  return (
    <div className="px-4 py-6 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Movies</h2>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>No movies available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {movies.map((movie, index) => (
            <div
              key={`${movie.id || movie.firebase_id || 'movie'}-${index}`}
              className="relative aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800/50 shadow-xl group cursor-pointer"
              onClick={() => onSelect(movie)}
            >
              <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
            <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
          )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              
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

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">{movie.rating || "N/A"}</span>
                </div>
                <h3 className="text-sm font-bold tracking-tight text-white shadow-black drop-shadow-md line-clamp-2">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
