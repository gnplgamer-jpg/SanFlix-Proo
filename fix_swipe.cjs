const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                      <div className="relative group/slider">
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
                          >`;

const newStr = `                      <div 
                        className="relative group/slider"
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          e.currentTarget.dataset.touchStartX = touch.clientX;
                          e.currentTarget.dataset.touchStartY = touch.clientY;
                        }}
                        onTouchEnd={(e) => {
                          const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX || '0');
                          const touchStartY = parseFloat(e.currentTarget.dataset.touchStartY || '0');
                          const touchEndX = e.changedTouches[0].clientX;
                          const touchEndY = e.changedTouches[0].clientY;
                          
                          const deltaX = touchStartX - touchEndX;
                          const deltaY = touchStartY - touchEndY;
                          
                          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                            if (deltaX > 0) {
                              // Swipe left (next)
                              setCurrentSlideIndex(prev => (prev + 1) % highlightedMovies.length);
                            } else {
                              // Swipe right (prev)
                              setCurrentSlideIndex(prev => (prev - 1 + highlightedMovies.length) % highlightedMovies.length);
                            }
                          }
                        }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSpotlight.id || currentSpotlight.firebase_id || 'spotlight'}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-zinc-800 shadow-xl group cursor-pointer bg-zinc-800/50" 
                            onClick={() => handleSelectMovie(currentSpotlight)}
                          >`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
