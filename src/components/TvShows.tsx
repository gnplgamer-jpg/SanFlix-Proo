import { Star, Play, TrendingUp } from 'lucide-react';

interface TvShowsProps {
  tvShows: any[];
  onSelect: (show: any) => void;
}

export function TvShows({ tvShows, onSelect }: TvShowsProps) {
  return (
    <div className="px-4 py-6 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">TV Shows & Series</h2>
      </div>

      {tvShows.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>No TV Shows available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tvShows.map((show, index) => (
            <div
              key={`${show.id || show.firebase_id || 'show'}-${index}`}
              className="relative aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800/50 shadow-xl group cursor-pointer"
              onClick={() => onSelect(show)}
            >
              <img
                src={show.poster_url || show.imageUrl}
                alt={show.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                {show.rating && parseFloat(show.rating) >= 8.5 && (
                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5">
                     <TrendingUp className="w-2.5 h-2.5" />
                     POPULAR
                   </div>
                )}
                <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-white/10">
                  {show.ad_gate ? (
                    <span className="text-red-500">🔒 VIP</span>
                  ) : (
                    <span className="text-green-400">⚡ HD</span>
                  )}
                </div>
                {((show.episodes && show.episodes.length > 0 && show.episodes[0].url) || show.eps_count > 0) && (
                   <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                     {show.eps_count > 0 ? `${show.eps_count} EPs` : (show.episodes ? `${show.episodes.length} EP${show.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                   </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">{show.rating || "N/A"}</span>
                </div>
                <h3 className="text-sm font-bold tracking-tight text-white shadow-black drop-shadow-md line-clamp-2">
                  {show.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
