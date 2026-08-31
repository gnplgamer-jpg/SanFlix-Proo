import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface Actress {
  name: string;
  tmdbId?: number;
  imageUrl?: string;
}

const predefinedActresses: Actress[] = [
  { name: 'Aliya Naaz', tmdbId: 3004810, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjYxZjg0ZjQtMzMyYy00NzlmLThiMTItY2YwM2M0NzgyMjc0XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Sneha Paul', tmdbId: 3062325, imageUrl: 'https://image.tmdb.org/t/p/w185/9ynw91mnpUAIlHu71W70LiAPZQZ.jpg' },
  { name: 'Ayesha Kapoor', tmdbId: 3072213, imageUrl: 'https://image.tmdb.org/t/p/w185/9adzxCqez08MTCvDL97YK8XTOIc.jpg' },
  { name: 'Mahi Kaur', tmdbId: 3020108, imageUrl: 'https://m.media-amazon.com/images/M/MV5BOGYzNTFlNGMtZjc3NC00ZGE2LTljMTEtNzMxMTRmZjBmMzA2XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Anveshi Jain', tmdbId: 2197825, imageUrl: 'https://image.tmdb.org/t/p/w185/7l2h5QyFc0dloUTlsIOPoSHz1ZM.jpg' },
  { name: 'Flora Saini', tmdbId: 1618035, imageUrl: 'https://image.tmdb.org/t/p/w185/mimiUPvv1S5L7kjXD79EKnfvSDs.jpg' },
  { name: 'Priya Gamre', tmdbId: 1386701, imageUrl: 'https://image.tmdb.org/t/p/w185/9hRYLNZ9uATRRvbjeFynuIusYVJ.jpg' },
  { name: 'Bharti Jha', tmdbId: 3878235, imageUrl: 'https://m.media-amazon.com/images/M/MV5BZWFiYWFmYTktMzFhZC00OTI0LWE1YWMtYjYzMWNiMWMzODg4XkEyXkFqcGc@._V1_UY256_CR21,0,172,256_AL_.jpg' },
  { name: 'Jinnie Jaaz', tmdbId: 2884240, imageUrl: 'https://m.media-amazon.com/images/M/MV5BNWU0NTZkODYtZjgxNC00NjIzLTkyMzktNzBkYzRiNTZkMWRjXkEyXkFqcGc@._V1_UY256_CR8,0,172,256_AL_.jpg' },
  { name: 'Hiral Radadiya', tmdbId: 3014138, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMGJlMmQwNTUtOTZiYi00Y2U1LTgzNjQtNTA3MDZiMzk0NDJjXkEyXkFqcGc@._V1_UX172_CR0,0,172,256_AL_.jpg' },
  { name: 'Rekha Mona Sarkar', tmdbId: 3089679, imageUrl: 'https://image.tmdb.org/t/p/w185/8aQIsJiJXpC1vgu2M01DflknCYB.jpg' },
  { name: 'Muskan Agarwal', tmdbId: 3514736, imageUrl: 'https://image.tmdb.org/t/p/w185/uCt9jLIa6hLpnmeW22Pj5yT3HXy.jpg' },
  { name: 'Shyna Khatri', tmdbId: 3881260, imageUrl: 'https://image.tmdb.org/t/p/w185/a2hnnIqbzgoBhQcqBffw72idX6O.jpg' },
  { name: 'Neha Gupta', tmdbId: 3450982, imageUrl: 'https://image.tmdb.org/t/p/w185/7xQSKykWYrzXGwVPZ8UqdxhdPt9.jpg' },
  { name: 'Kavita Radheshyam', tmdbId: 1395562, imageUrl: 'https://image.tmdb.org/t/p/w185/yain5ELFgRfH8S5pezHMt5FzZDA.jpg' },
];

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
                  <img
                    src={actress.imageUrl}
                    alt={actress.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
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
