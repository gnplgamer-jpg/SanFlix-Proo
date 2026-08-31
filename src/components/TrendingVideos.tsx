import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, Loader2, Play, Flame, Film, Clock } from 'lucide-react';

interface TrendingVideo {
  title: string;
  embed_url: string;
}

interface TrendingVideosProps {
  unlockedContent?: Record<string, number>;
  appMovies: any[];
  onSelectMovie: (movie: any) => void;
  onPlayUrl?: (url: string, title: string, movie?: any) => void;
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

export function TrendingVideos({ appMovies, onSelectMovie, onPlayUrl , unlockedContent = {}}: TrendingVideosProps) {
  const [videos, setVideos] = useState<TrendingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get top 10 movies from the app
  const topAppMovies = [...appMovies]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  // Get latest movies from the app
  const latestAppMovies = [...appMovies]
    .filter(m => m.release_date && m.release_date.includes('202') || m.release_date?.includes('201'))
    .sort((a, b) => {
       const da = new Date(a.release_date || '2000-01-01').getTime();
       const db = new Date(b.release_date || '2000-01-01').getTime();
       return db - da;
    })
    .slice(0, 10);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/trending-videos');
        if (!res.ok) throw new Error("Failed to fetch trending videos");
        const data = await res.json();
        
        if (data && data.videos) {
          setVideos(data.videos);
        } else {
          setVideos([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, []);

  return (
    <div className="pb-32 pt-4 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Latest & Trending from App */}
      {topAppMovies.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6 border-l-4 border-red-600 pl-3">
            <Flame className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-black text-white tracking-wider">
              HOT & TRENDING ON SANFLIX
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 px-2">
            {topAppMovies.map((movie, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => onSelectMovie(movie)}
                className="group cursor-pointer relative shrink-0 w-40 sm:w-48"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-lg border border-zinc-800 group-hover:border-red-500 transition-all">
                  <img
            src={movie.poster_url || movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            loading="lazy"
          />
          {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
            <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
          )}
                  <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-bl-xl shadow-md z-10">
                    #{idx + 1}
                  </div>
                  {movie.rating && parseFloat(movie.rating) >= 8.5 && (
                    <div className="absolute top-8 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded-l text-[10px] font-bold shadow-lg flex items-center gap-0.5 z-10 mt-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      POPULAR
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        let url = movie.streaming_link_1;
                        if (!url && movie.episodes && movie.episodes.length > 0) {
                          url = movie.episodes[0].url;
                        }
                        if (url && onPlayUrl) {
                           onPlayUrl(url, movie.title, movie);
                        } else {
                           onSelectMovie(movie);
                        }
                      }}
                      className="bg-red-600 text-white rounded-full p-3 shadow-lg shadow-red-600/50 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110"
                    >
                      <Play className="w-6 h-6 ml-1" fill="currentColor" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-zinc-200 line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-zinc-500">{movie.release_date || 'Unknown'} • {movie.rating ? movie.rating + '/10' : 'New'}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Global Trending Embeds */}
      <section>
        <div className="flex items-center gap-3 mb-6 border-l-4 border-red-600 pl-3">
          <TrendingUp className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-black text-white tracking-wider uppercase">
            Global Trending Trailers
          </h2>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
            <p>Loading global trending content...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-red-500 font-bold mb-2">Error Loading Videos</h3>
            <p className="text-red-400/80 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && videos.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-500">
            <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />
            <p className="font-bold">No trending videos found.</p>
          </div>
        )}

        {!isLoading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/20 hover:border-red-500/30 transition-all group"
              >
                <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-500 shrink-0" />
                  <h3 className="text-sm font-bold text-zinc-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
                <div className="w-full aspect-video bg-black relative">
                  {video.embed_url ? (
                    <iframe 
                      src={video.embed_url} 
                      className="w-full h-full absolute inset-0 border-none"
                      allowFullScreen 
                      scrolling="no"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      No Embed URL
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
