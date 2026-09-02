import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Radio, ChevronLeft, ChevronRight, SignalHigh } from 'lucide-react';

export interface Channel {
  id: string;
  name: string;
  category: string;
  logo: string;
  url: string;
  nowPlaying?: string;
}

export const trendingLiveChannels = [
  {
    "id": "trend_1",
    "name": "Star Plus",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Plus_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Anupamaa"
  },
  {
    "id": "trend_2",
    "name": "Sony Entertainment Television",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Kaun Banega Crorepati"
  },
  {
    "id": "trend_3",
    "name": "Aaj Tak",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png",
    "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
    "nowPlaying": "Breaking News"
  },
  {
    "id": "trend_4",
    "name": "Star Sports 1",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Sports_1_HD.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Match"
  },
  {
    "id": "trend_5",
    "name": "Cartoon Network",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Cartoon_Network.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Tom and Jerry"
  },
  {
    "id": "trend_6",
    "name": "Nepal Television (NTV)",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/2/23/Nepal_Television_Logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "NTV News"
  },
  {
    "id": "trend_7",
    "name": "Star Gold",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Gold_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Blockbuster Movie"
  },
  {
    "id": "trend_8",
    "name": "Zee Marathi",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Marathi_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Swarajya Rakshak Sambhaji"
  },
  {
    "id": "trend_9",
    "name": "Discovery Channel",
    "category": "Infotainment",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Discovery_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Man vs. Wild"
  },
  {
    "id": "trend_10",
    "name": "MTV",
    "category": "Music",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/MTV_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "MTV Splitsvilla"
  },
  {
    "id": "trend_11",
    "name": "Kantipur TV HD",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Kantipur_Television_Logo.png/220px-Kantipur_Television_Logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Kantipur Samachar"
  }
];

export function LiveTvRail({ onSelectChannel }: { onSelectChannel: (channel: Channel) => void }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8 select-none group mt-6">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 group-hover:text-red-500 transition-colors">
          <SignalHigh className="w-6 h-6 text-red-500 animate-pulse" />
          Trending Live TV
        </h2>
      </div>

      <button
        onClick={handleScrollLeft}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 text-white p-3 rounded-r-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleScrollRight}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 text-white p-3 rounded-l-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 md:px-12 pb-6 pt-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {trendingLiveChannels.map((channel) => (
          <motion.div
            key={channel.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectChannel(channel)}
            onMouseEnter={() => setHoveredChannel(channel.id)}
            onMouseLeave={() => setHoveredChannel(null)}
            onTouchStart={() => {
              touchTimer.current = setTimeout(() => {
                setHoveredChannel(channel.id);
              }, 500);
            }}
            onTouchEnd={() => {
              if (touchTimer.current) clearTimeout(touchTimer.current);
              setHoveredChannel(null);
            }}
            onTouchMove={() => {
              if (touchTimer.current) clearTimeout(touchTimer.current);
              setHoveredChannel(null);
            }}
            onContextMenu={(e) => {
              // Prevent context menu on long press
              if (hoveredChannel === channel.id) {
                e.preventDefault();
              }
            }}
            className="flex flex-col items-center gap-2 min-w-[120px] sm:min-w-[140px] cursor-pointer bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 hover:border-red-500/50 transition-all relative group overflow-hidden"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Now Playing Overlay */}
            <div 
              className={`absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300 ${hoveredChannel === channel.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <span className="text-[10px] text-red-500 font-bold mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                NOW PLAYING
              </span>
              <p className="text-white text-xs font-medium line-clamp-3">
                {channel.nowPlaying || 'Live Broadcast'}
              </p>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest text-white shadow-sm uppercase z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              LIVE
            </div>
            <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-full p-[2px] bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-lg mt-2">
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-2 relative flex items-center justify-center">
                <img
                  src={channel.logo || `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String(channel.name || 'TV').substring(0,3))}`}
                  alt={channel.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String((e.currentTarget as any).alt || 'TV').substring(0, 3))}`; }}
                />
              </div>
            </div>
            <div className="text-center w-full mt-1">
              <h3 className="text-white text-xs sm:text-sm font-bold truncate">
                {channel.name}
              </h3>
              <p className="text-zinc-500 text-[10px] sm:text-xs font-medium truncate mt-0.5">
                {channel.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
