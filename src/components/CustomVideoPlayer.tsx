import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomVideoPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function CustomVideoPlayer({ url, title, onClose }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'speed' | 'quality'>('main');
  const [initError, setInitError] = useState<Error | null>(null);

  if (initError) {
    throw initError;
  }

  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('mousemove', handleMouseMove);
      wrapper.addEventListener('touchstart', handleMouseMove);
      wrapper.addEventListener('mouseleave', () => setShowControls(false));
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('mousemove', handleMouseMove);
        wrapper.removeEventListener('touchstart', handleMouseMove);
        wrapper.removeEventListener('mouseleave', () => setShowControls(false));
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const toggleFullscreen = () => {
    const elem = wrapperRef.current;
    if (!document.fullscreenElement) {
      elem?.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Convert YouTube embed URLs to watch URLs for ReactPlayer
  let normalizedUrl = url.includes('youtube.com/embed/') 
    ? url.replace('youtube.com/embed/', 'youtube.com/watch?v=')
    : url;

  if (normalizedUrl.includes('youtube.com/watch?v=') && !normalizedUrl.includes('autoplay=1')) {
    normalizedUrl += normalizedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1';
  }

  // Check if we should render a raw iframe instead of ReactPlayer
  // ReactPlayer supports YouTube, Vimeo, Twitch, SoundCloud, Streamable, Facebook, DailyMotion
  // and direct video files (.mp4, .m3u8, .webm, .ogg).
  const isSupportedReactPlayerUrl = 
    normalizedUrl.includes('youtube.com') || 
    normalizedUrl.includes('youtu.be') || 
    normalizedUrl.includes('vimeo.com') ||
    normalizedUrl.includes('twitch.tv') ||
    normalizedUrl.includes('dailymotion.com') ||
    normalizedUrl.match(/\.(mp4|webm|ogg|m3u8)$/i) ||
    // Assume if it has 'download' or 'api' it might be a direct stream endpoint meant for video tag
    (normalizedUrl.includes('pixeldrain') && normalizedUrl.includes('api'));

  const renderPlayer = () => {
    if (!isSupportedReactPlayerUrl) {
      return (
        <iframe 
          src={normalizedUrl} 
          className="w-full h-full border-0 pointer-events-auto"
          allowFullScreen
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );
    }

    return (
      <div className="w-full h-full relative">
          <ReactPlayer
            ref={playerRef}
            url={normalizedUrl}
            width="100%"
            height="100%"
            playing={isReady && playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            controls={false}
            onReady={() => setIsReady(true)}
            onError={(e: any) => {
              console.error("ReactPlayer error:", e);
              setInitError(new Error("Video player initialization failed"));
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            config={{
              youtube: {
                // @ts-ignore - playerVars is valid for react-player youtube config
                playerVars: { 
                  showinfo: 0, 
                  modestbranding: 1, 
                  rel: 0, 
                  disablekb: 1, 
                  iv_load_policy: 3,
                  playsinline: 1,
                  autoplay: 1
                }
              },
              file: {
                forceVideo: true,
              }
            }}
          />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col" ref={wrapperRef}>
      {/* Player Engine */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
        {renderPlayer()}
      </div>

      {/* Custom Overlay & Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/60 flex flex-col justify-between ${!isSupportedReactPlayerUrl ? 'pointer-events-none' : ''}`}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
              <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md truncate pr-4">{title}</h3>
              <button 
                onClick={() => { setPlaying(false); onClose(); }} 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {isSupportedReactPlayerUrl && (
              <>
                {/* Click to play/pause centrally */}
                <div className="flex-1 cursor-pointer flex items-center justify-center pointer-events-auto" onClick={togglePlay}>
                    {!playing && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-2" />
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 flex flex-col gap-2 pointer-events-auto">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="hover:text-[#E50914] transition-colors">
                        {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <div className="flex items-center gap-2 group">
                        <button onClick={toggleMute} className="hover:text-[#E50914] transition-colors">
                          {muted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                        <input 
                          type="range" 
                          min={0} max={1} step="0.05" 
                          value={muted ? 0 : volume}
                          onChange={(e) => {
                              setVolume(parseFloat(e.target.value));
                              setMuted(parseFloat(e.target.value) === 0);
                          }}
                          className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 opacity-0 group-hover:opacity-100 accent-[#E50914]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                      <div className="relative">
                        <button 
                          onClick={() => {
                            if (!showSettings) setSettingsView('main');
                            setShowSettings(!showSettings);
                          }} 
                          className="hover:text-[#E50914] transition-colors"
                        >
                          <Settings className="w-6 h-6" />
                        </button>
                        
                        {/* Settings Menu */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-lg flex flex-col overflow-hidden shadow-2xl"
                                >
                                    {settingsView === 'main' && (
                                      <>
                                        <button 
                                          onClick={() => setSettingsView('quality')}
                                          className="px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors text-white flex justify-between items-center border-b border-zinc-800"
                                        >
                                          <span>Quality</span>
                                          <span className="text-zinc-400 text-xs">{quality}</span>
                                        </button>
                                        <button 
                                          onClick={() => setSettingsView('speed')}
                                          className="px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors text-white flex justify-between items-center"
                                        >
                                          <span>Playback Speed</span>
                                          <span className="text-zinc-400 text-xs">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                                        </button>
                                      </>
                                    )}

                                    {settingsView === 'speed' && (
                                      <>
                                        <button 
                                          onClick={() => setSettingsView('main')}
                                          className="px-4 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-left bg-zinc-800/50 hover:bg-zinc-800 transition"
                                        >
                                          ← Back
                                        </button>
                                        <div className="max-h-48 overflow-y-auto hide-scrollbar">
                                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                              <button 
                                                key={rate}
                                                onClick={() => { setPlaybackRate(rate); setSettingsView('main'); setShowSettings(false); }}
                                                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors ${playbackRate === rate ? 'text-[#E50914] font-bold' : 'text-white'}`}
                                              >
                                                  {rate === 1 ? 'Normal' : `${rate}x`}
                                              </button>
                                          ))}
                                        </div>
                                      </>
                                    )}

                                    {settingsView === 'quality' && (
                                      <>
                                        <button 
                                          onClick={() => setSettingsView('main')}
                                          className="px-4 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-left bg-zinc-800/50 hover:bg-zinc-800 transition"
                                        >
                                          ← Back
                                        </button>
                                        <div className="max-h-48 overflow-y-auto hide-scrollbar">
                                          {['Auto', '1080p', '720p', '480p', '360p'].map(q => (
                                              <button 
                                                key={q}
                                                onClick={() => { setQuality(q); setSettingsView('main'); setShowSettings(false); }}
                                                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors ${quality === q ? 'text-[#E50914] font-bold' : 'text-white'}`}
                                              >
                                                  {q}
                                              </button>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                      </div>
                      
                      <button onClick={toggleFullscreen} className="hover:text-[#E50914] transition-colors">
                        <Maximize className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
