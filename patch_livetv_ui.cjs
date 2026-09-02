const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Update video styles to include filters
const videoRegex = /<video\s+ref=\{videoRef\}\s+controls\s+autoPlay\s+playsInline\s+className="w-full h-full object-contain"\s+\/>/g;
const videoReplacement = `<video 
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              style={{ filter: \`brightness(\${videoFilters.brightness}%) contrast(\${videoFilters.contrast}%) saturate(\${videoFilters.saturation}%)\` }}
            />`;
code = code.replace(videoRegex, videoReplacement);

// Add action buttons overlay in the bottom right corner (above controls)
const overlayRegex = /\{\/\* Player Overlays \*\/\}/;
const overlayReplacement = `{/* Advanced Controls */}
          {!playerError && currentChannel && (
            <div className="absolute top-4 right-4 sm:top-auto sm:right-4 sm:bottom-16 flex flex-col sm:flex-row gap-2 z-20">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger"
                title="Player Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              {document.pictureInPictureEnabled && (
                <button 
                  onClick={() => videoRef.current?.requestPictureInPicture()} 
                  className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger"
                  title="Picture in Picture"
                >
                  <PictureInPicture className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Settings Modal */}
          {showSettings && (
            <div className="absolute right-4 top-16 sm:bottom-28 sm:top-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-[280px] z-50 shadow-2xl text-white">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-red-500" /> Advanced Settings</h4>
                <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
              
              {/* Quality Selector */}
              {qualities.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Stream Quality</label>
                  <select 
                    className="w-full bg-zinc-800 text-sm rounded-lg p-2 border border-zinc-700 outline-none"
                    value={currentQuality}
                    onChange={(e) => {
                      const level = parseInt(e.target.value);
                      setCurrentQuality(level);
                      if (hlsRef.current) {
                        hlsRef.current.currentLevel = level;
                      }
                    }}
                  >
                    <option value="-1">Auto (Smooth)</option>
                    {qualities.map(q => (
                      <option key={q.level} value={q.level}>{q.height}p</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Video Enhancements */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Brightness</span>
                    <span>{videoFilters.brightness}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={videoFilters.brightness} onChange={(e) => setVideoFilters({...videoFilters, brightness: parseInt(e.target.value)})} className="w-full accent-red-500 h-1 bg-zinc-700 rounded-full appearance-none" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Contrast</span>
                    <span>{videoFilters.contrast}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={videoFilters.contrast} onChange={(e) => setVideoFilters({...videoFilters, contrast: parseInt(e.target.value)})} className="w-full accent-red-500 h-1 bg-zinc-700 rounded-full appearance-none" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Saturation (Vibrance)</span>
                    <span>{videoFilters.saturation}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={videoFilters.saturation} onChange={(e) => setVideoFilters({...videoFilters, saturation: parseInt(e.target.value)})} className="w-full accent-red-500 h-1 bg-zinc-700 rounded-full appearance-none" />
                </div>
              </div>
            </div>
          )}
          
          {/* Player Overlays */}`;
code = code.replace(overlayRegex, overlayReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Added Advanced UI');
