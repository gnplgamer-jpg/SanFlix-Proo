const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = `  const [nextVideoCountdown, setNextVideoCountdown] = useState<{
    movie: any;
    timeLeft: number;
  } | null>(null);`;

const replacement1 = `  const [nextVideoCountdown, setNextVideoCountdown] = useState<{
    movie: any;
    timeLeft: number;
    nextEpisode?: any;
  } | null>(null);`;

code = code.replace(target1, replacement1);

const target2 = `  useEffect(() => {
    if (!nextVideoCountdown) return;
    if (nextVideoCountdown.timeLeft <= 0) {
      // Play next
      const nextMovie = nextVideoCountdown.movie;
      setNextVideoCountdown(null);
      // Auto-select the first available stream for next movie
      let url = nextMovie.download_link_480p || nextMovie.download_link_720p || nextMovie.download_link_1080p || nextMovie.download_link_hdr;
      if (!url && nextMovie.is_direct_streaming && nextMovie.language_urls?.length > 0) {
        url = nextMovie.language_urls[0].url;
      }
      if (url) {
        setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false });
      } else {
        setGlobalVideo(null);
      }
      return;
    }`;

const replacement2 = `  useEffect(() => {
    if (!nextVideoCountdown) return;
    if (nextVideoCountdown.timeLeft <= 0) {
      // Play next
      const nextMovie = nextVideoCountdown.movie;
      const nextEpisode = nextVideoCountdown.nextEpisode;
      setNextVideoCountdown(null);
      
      let url;
      if (nextEpisode && nextEpisode.url) {
        url = nextEpisode.url;
      } else {
        // Auto-select the first available stream for next movie
        url = nextMovie.download_link_480p || nextMovie.download_link_720p || nextMovie.download_link_1080p || nextMovie.download_link_hdr;
        if (!url && nextMovie.is_direct_streaming && nextMovie.language_urls?.length > 0) {
          url = nextMovie.language_urls[0].url;
        } else if (!url && nextMovie.episodes && nextMovie.episodes.length > 0) {
          url = nextMovie.episodes[0].url;
        } else if (!url && nextMovie.streaming_link_1) {
          url = nextMovie.streaming_link_1;
        }
      }

      if (url) {
        setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false });
      } else {
        setGlobalVideo(null);
      }
      return;
    }`;

code = code.replace(target2, replacement2);


const target3 = `                onEnded={() => {
                  const currentIndex = filteredContent.findIndex(m => m.id === globalVideo.movie?.id || m.firebase_id === globalVideo.movie?.firebase_id);
                  if (currentIndex !== -1 && currentIndex + 1 < filteredContent.length) {
                    // Try to find sequel/next episode
                    let nextMovie = filteredContent.slice(currentIndex + 1).find(m => 
                      m.mapped_category_rail === globalVideo.movie.mapped_category_rail && 
                      m.media_layout_format === globalVideo.movie.media_layout_format
                    );
                    if (!nextMovie) nextMovie = filteredContent[currentIndex + 1];
                    if (nextMovie) {
                      setNextVideoCountdown({ movie: nextMovie, timeLeft: 10 });
                      return;
                    }
                  }
                  setGlobalVideo(null);
                }}`;

const replacement3 = `                onEnded={() => {
                  if (globalVideo.movie?.episodes && globalVideo.movie.episodes.length > 0) {
                     const currentEpIndex = globalVideo.movie.episodes.findIndex((ep: any) => ep.url === globalVideo.url);
                     if (currentEpIndex !== -1 && currentEpIndex + 1 < globalVideo.movie.episodes.length) {
                        const nextEpisode = globalVideo.movie.episodes[currentEpIndex + 1];
                        if (nextEpisode && nextEpisode.url) {
                            setNextVideoCountdown({ movie: globalVideo.movie, timeLeft: 10, nextEpisode: nextEpisode });
                            return;
                        }
                     }
                  }

                  const currentIndex = filteredContent.findIndex(m => m.id === globalVideo.movie?.id || m.firebase_id === globalVideo.movie?.firebase_id);
                  if (currentIndex !== -1 && currentIndex + 1 < filteredContent.length) {
                    // Try to find sequel/next movie
                    let nextMovie = filteredContent.slice(currentIndex + 1).find(m => 
                      m.mapped_category_rail === globalVideo.movie.mapped_category_rail && 
                      m.media_layout_format === globalVideo.movie.media_layout_format
                    );
                    if (!nextMovie) nextMovie = filteredContent[currentIndex + 1];
                    if (nextMovie) {
                      setNextVideoCountdown({ movie: nextMovie, timeLeft: 10 });
                      return;
                    }
                  }
                  setGlobalVideo(null);
                }}`;

code = code.replace(target3, replacement3);

const target4 = `              {/* Next Episode Countdown Modal */}
              <AnimatePresence>
                {nextVideoCountdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed right-8 bottom-32 z-[250] bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 w-80 text-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-400 mb-1">Up Next in {nextVideoCountdown.timeLeft}s</h4>
                        <h3 className="font-bold line-clamp-2">{nextVideoCountdown.movie.title}</h3>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNextVideoCountdown(null);
                        }}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setNextVideoCountdown({ ...nextVideoCountdown, timeLeft: 0 });
                        }}
                        className="flex-1 bg-white text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                      >
                        <Play className="w-4 h-4 fill-black" /> Play Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>`;

const replacement4 = `              {/* Next Episode/Video Countdown Modal */}
              <AnimatePresence>
                {nextVideoCountdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed right-8 bottom-32 z-[250] bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 w-80 text-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-400 mb-1">Up Next in {nextVideoCountdown.timeLeft}s</h4>
                        <h3 className="font-bold line-clamp-2">
                          {nextVideoCountdown.nextEpisode ? nextVideoCountdown.nextEpisode.title : nextVideoCountdown.movie.title}
                        </h3>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNextVideoCountdown(null);
                        }}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setNextVideoCountdown({ ...nextVideoCountdown, timeLeft: 0 });
                        }}
                        className="flex-1 bg-white text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                      >
                        <Play className="w-4 h-4 fill-black" /> Play Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>`;

code = code.replace(target4, replacement4);

fs.writeFileSync('src/App.tsx', code);
