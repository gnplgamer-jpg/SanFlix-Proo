import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { BlurImage } from './BlurImage';
import { Sparkles, ChevronRight, ChevronLeft, Clock } from 'lucide-react';

interface Actress {
  name: string;
  tmdbId?: number;
  imageUrl?: string;
}

export const predefinedActresses: Actress[] = [
  { name: 'Aliya Naaz', tmdbId: 3004810, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjYxZjg0ZjQtMzMyYy00NzlmLThiMTItY2YwM2M0NzgyMjc0XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Sneha Paul', tmdbId: 3062325, imageUrl: 'https://image.tmdb.org/t/p/w185/9ynw91mnpUAIlHu71W70LiAPZQZ.jpg' },
  { name: 'Disha Patani', tmdbId: 1546398, imageUrl: 'https://image.tmdb.org/t/p/w185/jeFgIW3d3BP6MkfnMlmEGP33Oyq.jpg' },
  { name: 'Nora Fatehi', tmdbId: 1488785, imageUrl: 'https://image.tmdb.org/t/p/w185/jKvLkySOJFUUnUdE7Zo4oPb9ZzM.jpg' },
  { name: 'Shraddha Kapoor', tmdbId: 130991, imageUrl: 'https://image.tmdb.org/t/p/w185/tFx6DRETklfkFIUu5Sl5TCN1gD9.jpg' },
  { name: 'Deepika Padukone', tmdbId: 53975, imageUrl: 'https://image.tmdb.org/t/p/w185/rzvvBQ0r6oiqDdzcsdTRB7jN4Rx.jpg' },
  { name: 'Mrunal Thakur', tmdbId: 1766034, imageUrl: 'https://image.tmdb.org/t/p/w185/4ITqe6SrpQgwUFU52rkmZNffyrM.jpg' },
  { name: 'Kiara Advani', tmdbId: 1340978, imageUrl: 'https://image.tmdb.org/t/p/w185/2xmU03a6kTWUvuTPMdofiFLxdAw.jpg' },
  { name: 'Janhvi Kapoor', tmdbId: 1974970, imageUrl: 'https://image.tmdb.org/t/p/w185/2VqBDc19br9CIitXUFkZ52q7V2o.jpg' },
  { name: 'Pooja Hegde', tmdbId: 587753, imageUrl: 'https://image.tmdb.org/t/p/w185/t09lf8vem5MRk3KaALcdgehreXg.jpg' },
  { name: 'Rashmika Mandanna', tmdbId: 1752056, imageUrl: 'https://image.tmdb.org/t/p/w185/wr60ZDcMfYRPU6IM3PrsaOCw5ZV.jpg' },
  { name: 'Mouni Roy', tmdbId: 1251224, imageUrl: 'https://image.tmdb.org/t/p/w185/bopoygerwuqnt1WaTPULn5izxRQ.jpg' },
  { name: 'Esha Gupta', tmdbId: 1040950, imageUrl: 'https://image.tmdb.org/t/p/w185/zNvRvv4Ifu1kRMzHecSzD3pn62y.jpg' },
  { name: 'Tamannaah Bhatia', tmdbId: 85721, imageUrl: 'https://image.tmdb.org/t/p/w185/t4WYoKiFAyO1Rhjv7O03EKmJHp4.jpg' },
  { name: 'Kriti Sanon', tmdbId: 1285028, imageUrl: 'https://image.tmdb.org/t/p/w185/yYqQBLxsjNw1WXakmbC8WwKoPFs.jpg' },
];


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

export function ActressRail({ onSelectActress }: { onSelectActress: (name: string) => void }) {
  const [actresses, setActresses] = useState<Actress[]>(predefinedActresses);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  


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
    <div className="relative mb-12 select-none group">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 group-hover:text-red-500 transition-colors">
          <Sparkles className="w-6 h-6 text-pink-500" />
          Trending Actresses
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
        {actresses.map((actress, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectActress(actress.name)}
            className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[110px] cursor-pointer"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 border-2 border-black relative">
                {actress.imageUrl ? (
                  <BlurImage src={actress.imageUrl} alt={actress.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-500 bg-zinc-900">
                    {actress.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <p className="text-white text-xs sm:text-sm font-bold text-center leading-tight">
              {actress.name.split(' ').map((part, i) => <span key={i} className="block">{part}</span>)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
