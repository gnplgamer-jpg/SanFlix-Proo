const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                        <button 
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
                        </button>`;

const newStr = `                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(prev => (prev - 1 + highlightedMovies.length) % highlightedMovies.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-black/50 transition-colors"
                        >
                          <ChevronLeft className="w-8 h-8 drop-shadow-md" />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex(prev => (prev + 1) % highlightedMovies.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-black/50 transition-colors"
                        >
                          <ChevronRight className="w-8 h-8 drop-shadow-md" />
                        </button>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
