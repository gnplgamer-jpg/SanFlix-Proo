const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Ensure ChevronRight is imported
if (!code.includes('ChevronRight')) {
  code = code.replace(
    "import { Info, Play, Star, Tv, Heart, History, ChevronLeft, TrendingUp } from 'lucide-react';",
    "import { Info, Play, Star, Tv, Heart, History, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';"
  );
}

// Add the slide control functions and update the motion.div
const targetStr = `                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSpotlight.id || currentSpotlight.firebase_id || 'spotlight'}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-zinc-800 shadow-xl group cursor-pointer bg-zinc-800/50" 
                          onClick={() => handleSelectMovie(currentSpotlight)}
                        >
                          <img
                            src={currentSpotlight.backdrop_url || currentSpotlight.imageUrl}
                            alt={currentSpotlight.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          
                          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500 text-[10px] font-bold tracking-wider">🔥 SPOTLIGHT HOT RELEASE</span>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white !leading-tight shadow-black drop-shadow-md">
                              {currentSpotlight.title}
                            </h1>
                            <button className="flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl py-2.5 px-4 mt-2 hover:bg-zinc-200 transition-colors">
                              <Info className="w-4 h-4" />
                              <span className="text-sm">Extract More Details</span>
                            </button>
                          </div>
                        </motion.div>
                      </AnimatePresence>`;

const newStr = `                      <div className="relative group/slider">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSpotlight.id || currentSpotlight.firebase_id || 'spotlight'}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                              const swipe = Math.abs(offset.x) * velocity.x;
                              const swipeThreshold = 500;
                              if (swipe < -swipeThreshold || offset.x < -50) {
                                setCurrentSlideIndex(prev => (prev + 1) % highlightedMovies.length);
                              } else if (swipe > swipeThreshold || offset.x > 50) {
                                setCurrentSlideIndex(prev => (prev - 1 + highlightedMovies.length) % highlightedMovies.length);
                              }
                            }}
                            className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-zinc-800 shadow-xl group cursor-pointer bg-zinc-800/50" 
                            onClick={() => handleSelectMovie(currentSpotlight)}
                          >
                            <img
                              src={currentSpotlight.backdrop_url || currentSpotlight.imageUrl}
                              alt={currentSpotlight.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2 pointer-events-none">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-500 text-[10px] font-bold tracking-wider">🔥 SPOTLIGHT HOT RELEASE</span>
                              </div>
                              <h1 className="text-2xl font-extrabold tracking-tight text-white !leading-tight shadow-black drop-shadow-md">
                                {currentSpotlight.title}
                              </h1>
                              <button className="flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl py-2.5 px-4 mt-2 pointer-events-auto hover:bg-zinc-200 transition-colors">
                                <Info className="w-4 h-4" />
                                <span className="text-sm">Extract More Details</span>
                              </button>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(prev => (prev - 1 + highlightedMovies.length) % highlightedMovies.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white/20 z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(prev => (prev + 1) % highlightedMovies.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white/20 z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
