import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Play, AlertCircle, Loader2 } from 'lucide-react';

interface PhubVideo {
  title?: string;
  embed_url?: string;
  image?: string;
  thumbnail?: string;
  thumb?: string;
  poster?: string;
}

export function PhubAPIContent({ onPlayUrl }: { onPlayUrl: (url: string, title: string) => void }) {
  const [videos, setVideos] = useState<PhubVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch('/api/phub-trending');
        if (!res.ok) throw new Error("Failed to fetch API");
        const data = await res.json();
        
        if (data && data.videos && Array.isArray(data.videos)) {
          setVideos(data.videos);
        } else if (Array.isArray(data)) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApi();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
        <p className="text-zinc-500 text-xs">Loading Live Videos...</p>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return null; // hide if error or empty
  }

  return (
    <div className="px-0 mb-6">
      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-orange-500 ml-4 rounded-sm h-4">
        <Star className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porn Hub (Live API)</h2>
        <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Live</span>
      </div>
      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
        {videos.map((video, idx) => {
          const imgUrl = video.image || video.thumbnail || video.thumb || video.poster || 'https://via.placeholder.com/300x400/000000/F97316?text=No+Image';
          const title = video.title || 'Untitled Video';
          
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (video.embed_url) {
                  onPlayUrl(video.embed_url, title);
                }
              }}
              className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] border-2 border-orange-500/30 group-hover:border-orange-500 transition-all">
                <img
                  src={imgUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 border border-orange-500/30">
                  LIVE API
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-black leading-tight line-clamp-2 text-zinc-100">{title}</h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
