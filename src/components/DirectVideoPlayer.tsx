import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Settings, X, FastForward, Rewind, Maximize, Sun, Volume2, VolumeX, Globe, Loader2, MonitorPlay, Lock, Unlock, RotateCw, Timer, Smartphone, ArrowLeft, Cast, Wand2, AlertCircle, Download } from 'lucide-react';
import Hls from 'hls.js';

interface DirectVideoPlayerProps {
  isPremium?: boolean;
  onRequirePremium?: () => void;
  url: string;
  title: string;
  onClose: () => void;
  onShowQualitySelector: () => void;
  onShowLanguageSelector: () => void;
  onShowEpisodeSelector?: () => void;
  hasLanguages: boolean;
  hasQualities: boolean;
  hasEpisodes?: boolean;
  onEnded?: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
  fallbackUrls?: string[];
  onReport?: () => void;
  initialTime?: number;
}

export function DirectVideoPlayer({
 
  url: rawUrl, 
  title, 
  onClose, 
  onShowQualitySelector,
  onShowLanguageSelector,
  onShowEpisodeSelector,
  hasLanguages,
  isPremium = false,
  onRequirePremium,
  hasQualities,
  hasEpisodes,
  onEnded,
  onProgressUpdate,
  fallbackUrls = [],
  onReport,
  initialTime = 0
}: DirectVideoPlayerProps) {
  // Extract video URL if image URL is concatenated with it (e.g., .jpghttps://...)
  let extractedUrl = rawUrl;
  if (extractedUrl && typeof extractedUrl === 'string') {
    const httpMatches = extractedUrl.match(/(https?:\/\/)/g);
    if (httpMatches && httpMatches.length > 1) {
      const parts = extractedUrl.split(/(?=https?:\/\/)/);
      extractedUrl = parts[parts.length - 1];
    }
  }

  // Strip ?download for pixeldrain because browsers refuse to play videos with Content-Disposition: attachment
  let initialUrl = extractedUrl?.includes('pixeldrain') && extractedUrl?.includes('?download') ? extractedUrl.replace('?download', '') : extractedUrl;

  // Proxy Google Drive links to strip Content-Disposition headers and bypass browser download prompt
  if (initialUrl?.includes('drive.google.com')) {
    initialUrl = `/api/proxy/video?url=${encodeURIComponent(initialUrl)}`;
  }
  
  const [url, setUrl] = useState(initialUrl);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setUrl(initialUrl);
    setFallbackIndex(0);
    setHasError(false);
  }, [initialUrl]);

  const handleVideoError = () => {
    if (fallbackIndex < fallbackUrls.length) {
      console.log('Falling back to next URL...', fallbackUrls[fallbackIndex]);
      setUrl(fallbackUrls[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
    } else {
      console.error('All fallback URLs failed.');
      if (onReport) onReport();
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [resizeMode, setResizeMode] = useState<'fit' | 'fill' | 'zoom'>('fit');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isHidden, setIsHidden] = useState(false);
  
  const [isLocked, setIsLocked] = useState(false);
  const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [visualEnhancer, setVisualEnhancer] = useState('Original');
  const [showVisualEnhancerPanel, setShowVisualEnhancerPanel] = useState(false);
  const [proUnlockEndTime, setProUnlockEndTime] = useState<number | null>(null);
  const [unlockingFilter, setUnlockingFilter] = useState<string | null>(null);
  const [proTimeLeft, setProTimeLeft] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (proUnlockEndTime) {
      interval = setInterval(() => {
        const remaining = proUnlockEndTime - Date.now();
        if (remaining <= 0) {
          setProUnlockEndTime(null);
          setVisualEnhancer('Original');
          setProTimeLeft(0);
        } else {
          setProTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [proUnlockEndTime]);

  const VISUAL_FILTERS = [
    { name: 'Original', css: 'none', isPro: false, img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { name: 'Clear', css: 'contrast(1.1) brightness(1.05)', isPro: false, img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e' },
    { name: 'HDR', css: 'contrast(1.25) saturate(1.3) brightness(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968' },
    { name: 'Ultra Clear', css: 'contrast(1.15) saturate(1.2) brightness(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f' },
    { name: 'Arctic Blue', css: 'sepia(0.2) hue-rotate(180deg) saturate(1.5) contrast(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb' },
    { name: 'Warm Glow', css: 'sepia(0.4) saturate(1.4) contrast(1.1)', isPro: true, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
    { name: 'Cinematic', css: 'contrast(1.2) saturate(0.8) sepia(0.2)', isPro: true, img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1' }
  ];

    const handleApplyFilter = async (filter: any) => {
    if (filter.isPro && !proUnlockEndTime) {
      setUnlockingFilter(filter.name);
      try {
        if ((window as any).Capacitor?.isNativePlatform()) {
          const { AdMob, RewardAdPluginEvents } = require('@capacitor-community/admob');
          const { UnityAds } = require('capacitor-unity-ads');
          const { AD_CONFIG } = require('../config/ads');

          try {
            // Try AdMob first
            AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem) => {
              setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
              setVisualEnhancer(filter.name);
            });
            await AdMob.prepareRewardVideoAd({ adId: AD_CONFIG.admob.rewarded, isTesting: false });
            await AdMob.showRewardVideoAd();
          } catch(admobErr) {
            console.error("AdMob Rewarded Error", admobErr);
            try {
              // Fallback to UnityAds
              await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
              const result = await UnityAds.showRewardedVideo();
              if (result && result.success) {
                 setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
                 setVisualEnhancer(filter.name);
              } else {
                 alert('Ad failed to load. Please try again.');
              }
            } catch(unityErr) {
               console.error("UnityAds fallback error", unityErr);
               setProUnlockEndTime(Date.now() + 2 * 60 * 1000);
               setVisualEnhancer(filter.name);
            }
          }
        } else {
          // Web fallback
          setTimeout(() => {
            setProUnlockEndTime(Date.now() + 2 * 60 * 1000); // 2 minutes
            setVisualEnhancer(filter.name);
            setUnlockingFilter(null);
          }, 1500);
          return;
        }
      } catch (e) {
         console.error(e);
         // Auto unlock on error for fallback
         setProUnlockEndTime(Date.now() + 2 * 60 * 1000);
         setVisualEnhancer(filter.name);
      }
      setUnlockingFilter(null);
    } else {
      setVisualEnhancer(filter.name);
    }
  };
  
  const [audioOnlyWarning, setAudioOnlyWarning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  
  const [showControls, setShowControls] = useState(true);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [swipeIndicator, setSwipeIndicator] = useState<{type: 'brightness'|'volume', value: number} | null>(null);
  const swipeIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [initError, setInitError] = useState<Error | null>(null);

  if (initError) {
    throw initError;
  }

  // Handle URL change seamlessly and HLS setup
  const isFirstLoad = useRef(true);
  const initialTimeApplied = useRef(false);
  const previousUrl = useRef(url);
  useEffect(() => {
    if (!videoRef.current) return;
    
    try {
      // Destroy previous HLS instance if it exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

    let time = 0;
    if (isFirstLoad.current) {
       time = initialTime || 0;
       isFirstLoad.current = false;
    } else {
       time = previousUrl.current !== url ? videoRef.current.currentTime : 0;
    }
    const wasPlaying = previousUrl.current !== url ? !videoRef.current.paused : true;
    previousUrl.current = url;

    setIsLoading(true);

    const isHlsUrl = url?.includes('.m3u8') || url?.includes('m3u8');
    if (Hls.isSupported() && isHlsUrl) {
      const hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
        // --- 1. ABR (Adaptive Bitrate) CONFIGURATION ---
        startLevel: -1, // Auto start quality based on bandwidth
        abrEwmaDefaultEstimate: 500000, // Default bandwidth estimate
        abrBandWidthFactor: 0.9,
        abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: true,
        // --- 2. AUTO-REPAIR & AUDIO FALLBACK CONFIGURATION ---
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 3,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
      });
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (localStorage.getItem('SANFLIX_BATTERY_SAVER') === 'true') {
          let cappingLevel = -1;
          data.levels.forEach((level: any, index: number) => {
            if (level.height <= 480 && (cappingLevel === -1 || level.height > data.levels[cappingLevel].height)) {
              cappingLevel = index;
            }
          });
          if (cappingLevel !== -1) {
            hls.autoLevelCapping = cappingLevel;
            hls.currentLevel = cappingLevel;
          } else if (data.levels.length > 0) {
            hls.autoLevelCapping = 0;
            hls.currentLevel = 0;
          }
        }

        if (videoRef.current) {
          videoRef.current.currentTime = time;
          if (time === initialTime && time > 0) initialTimeApplied.current = true;
          videoRef.current.volume = volume;
          videoRef.current.muted = isMuted;
          videoRef.current.playbackRate = playbackSpeed;
          if (wasPlaying) {
            videoRef.current.play().catch(() => { setIsPlaying(false); });
          }
          setIsLoading(false);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                 console.warn("Not an HLS stream (manifest parse failed). Falling back to native video...");
                 hls.destroy();
                 if (videoRef.current) {
                   videoRef.current.src = url;
                   videoRef.current.load();
                 }
                 break;
              }
              console.warn("Fatal network error encountered. Trying to recover...", data.details);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Fatal media error encountered. Attempting to recover...", data.details);
              
              // --- 1. VIDEO TRACK FAILURE (CODEC MISMATCH) ---
              // If high-quality video codec fails (e.g., BUFFER_APPEND_ERROR on HEVC/AV1), drop to safe fallback
              if (data.details === Hls.ErrorDetails.BUFFER_APPEND_ERROR || data.details === Hls.ErrorDetails.BUFFER_APPENDING_ERROR) {
                console.warn("Video Codec Mismatch detected! Auto-repairing by dropping to a safer fallback video profile while keeping current audio track...");
                // Force downgrade to lowest safe level (usually H.264 480p/720p)
                if (hls.levels && hls.levels.length > 0) {
                   hls.currentLevel = 0; 
                }
              }
              
              hls.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable error:", data.details);
              hls.destroy();
              if (fallbackIndex < fallbackUrls.length) {
                 handleVideoError();
              } else if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
              }
              break;
          }
        } else {
           // --- 3. ABR (Adaptive Bitrate) SEAMLESS SHIFT ---
           if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
              console.warn("Buffer Stalled! Network drops detected. ABR is taking over to seamlessly switch quality based on current speed...");
              hls.nextLoadLevel = -1; // Force ABR to recalculate and shift seamlessly
           }
           
           // --- 2. AUDIO TRACK FAILURE (CODEC MISMATCH) ---
           if (
              data.details === Hls.ErrorDetails.AUDIO_TRACK_LOAD_ERROR || 
              data.details === Hls.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT ||
              (data.type === Hls.ErrorTypes.MEDIA_ERROR && data.details.includes('audio'))
           ) {
              console.warn("Premium Audio Track failed (Codec/Load issue). Hot-swapping to a safe fallback audio track (e.g. AAC) while preserving high-quality video...");
              if (hls.audioTracks && hls.audioTracks.length > 1) {
                 // Try to fallback to the next available audio track
                 hls.audioTrack = (hls.audioTrack + 1) % hls.audioTracks.length;
              }
           }
        }
      });
    } else {
      // Standard video format (e.g. mp4) or Safari Native HLS
      videoRef.current.src = url;
      videoRef.current.load();
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackSpeed;

      const handleLoadedMetadata = () => {
        if (videoRef.current && time > 0) {
          videoRef.current.currentTime = time;
        }
        videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        if (wasPlaying) {
          videoRef.current?.play().catch(() => {
             setIsPlaying(false);
          });
        }
        videoRef.current?.removeEventListener('canplay', handleCanPlay);
      };

      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('canplay', handleCanPlay);
    }
    } catch (e) {
      console.error(e);
      setInitError(e instanceof Error ? e : new Error("Video player initialization failed"));
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]); // Removed volume, isMuted, playbackSpeed from dependencies so it doesn't reload video on volume change

  // Clean up on unmount and handle visibility change (Background Audio Leak fix)
  useEffect(() => {
    const video = videoRef.current;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (document.pictureInPictureElement !== videoRef.current && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    
    const handleLeavePiP = () => {
      setIsHidden(false);
      if (video?.paused) {
        onClose();
      }
    };

    const handleEnterPiP = () => {
      setIsHidden(true);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (video) {
       video.addEventListener('leavepictureinpicture', handleLeavePiP);
       video.addEventListener('enterpictureinpicture', handleEnterPiP);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (video) {
         video.removeEventListener('leavepictureinpicture', handleLeavePiP);
         video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
      }
      try {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture().catch(() => {});
        }
      } catch (err) {}
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (err) {}
      try {
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
          // @ts-ignore
          screen.orientation.unlock();
        }
      } catch (err) {}
    };
  }, []);

  // Sleep Timer logic
  useEffect(() => {
    if (sleepTimer === null) return;
    const timeoutId = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        setSleepTimer(null); // Reset timer
      }
    }, sleepTimer * 60 * 1000);
    return () => clearTimeout(timeoutId);
  }, [sleepTimer]);

  // Controls visibility
  useEffect(() => {
    const handleActivity = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('mousemove', handleActivity);
      wrapper.addEventListener('touchstart', handleActivity);
      wrapper.addEventListener('click', handleActivity);
    }
    handleActivity();
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('mousemove', handleActivity);
        wrapper.removeEventListener('touchstart', handleActivity);
        wrapper.removeEventListener('click', handleActivity);
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    setShowVolumeSlider(false);
    setShowBrightnessSlider(false);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const skip = (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + amount, 0), duration);
    }
  };

  const toggleLock = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isLocked) {
      // Lock it
      try {
        if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen().catch(() => {});
        }
        // @ts-ignore
        if (screen.orientation && (screen.orientation as any).lock) {
          const isPortrait = window.innerHeight > window.innerWidth;
          // @ts-ignore
          
          if (Capacitor.isNativePlatform()) {
            await (ScreenOrientation as any).lock({ orientation: isPortrait ? 'portrait' : 'landscape' as any }).catch(() => {});
          } else {
            await (screen.orientation as any).lock(isPortrait ? 'portrait' : 'landscape').catch(() => {});
          }

        }
      } catch (err) {}
      setIsLocked(true);
      setShowControls(false); // Hide controls immediately so they see the lock effect
    } else {
      // Unlock it
      if (!isLandscapeLocked) {
        try {
          // @ts-ignore
          if (screen.orientation && screen.orientation.unlock) {
            // @ts-ignore
            screen.orientation.unlock();
          }
        } catch (err) {}
      }
      setIsLocked(false);
    }
  };

  const toggleLandscapeLock = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    if (isLandscapeLocked) {
      // Unlock orientation
      try {
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
          // @ts-ignore
          screen.orientation.unlock();
        }
      } catch (err) {}
      setIsLandscapeLocked(false);
    } else {
      // Lock to landscape
      try {
        if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen().catch(() => {});
        }
        // @ts-ignore
        if (screen.orientation && (screen.orientation as any).lock) {
          // @ts-ignore
          
          if (Capacitor.isNativePlatform()) {
            await (ScreenOrientation as any).lock({ orientation: 'landscape' }).catch(() => {});
          } else {
            await (screen.orientation as any).lock('landscape').catch(() => {});
          }

        }
      } catch (err) {}
      setIsLandscapeLocked(true);
    }
  };

  const cycleSleepTimer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    setSleepTimer(prev => prev === null ? 15 : prev === 15 ? 30 : prev === 30 ? 60 : null);
  };

  const cycleResizeMode = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    if (resizeMode === 'fit') {
      try {
        if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen().catch(() => {});
        }
      } catch (err) {}
      try {
        // @ts-ignore
        if (screen.orientation && (screen.orientation as any).lock) {
          // @ts-ignore
          
          if (Capacitor.isNativePlatform()) {
            await (ScreenOrientation as any).lock({ orientation: 'landscape' }).catch(() => {});
          } else {
            await (screen.orientation as any).lock('landscape').catch(() => {});
          }

        }
      } catch (err) {}
      
      setResizeMode('fill');
    } else if (resizeMode === 'fill') {
      setResizeMode('zoom');
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      } catch (err) {}
      try {
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
          // @ts-ignore
          screen.orientation.unlock();
        }
      } catch (err) {}
      
      setResizeMode('fit');
    }
  };

  const cyclePlaybackSpeed = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    // Create an invisible anchor tag to trigger the download through our proxy
    const downloadUrl = `/api/proxy/download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || 'video')}`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = title ? `${title}.mp4` : 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const togglePiP = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && videoRef.current && videoRef.current.readyState >= 1) {
        if (videoRef.current.videoWidth > 0) {
          await videoRef.current.requestPictureInPicture();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Swipe Gestures
  const touchStartY = useRef<number>(0);
  const touchStartVal = useRef<number>(0);
  const activeZone = useRef<'left' | 'right' | null>(null);

  useEffect(() => {
    // Initialize Cast API
    const initCast = () => {
      try {
        // @ts-ignore
        const castContext = cast.framework.CastContext.getInstance();
        castContext.setOptions({
          // @ts-ignore
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          // @ts-ignore
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });
      } catch (e) {
        console.error("Cast initialization error:", e);
      }
    };

    // @ts-ignore
    if (window.cast && window.cast.framework && window.cast.framework.CastContext) {
       initCast();
    } else {
      // @ts-ignore
      window.__onGCastApiAvailable = function(isAvailable) {
        if (isAvailable) {
          initCast();
        }
      };
    }
  }, []);

  const handleCast = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    if (url.startsWith('blob:')) {
      alert("Casting is not supported for downloaded offline videos.");
      return;
    }

    // Try official Cast Framework first
    // @ts-ignore
    if (window.cast && window.cast.framework && window.chrome && window.chrome.cast) {
      try {
        // @ts-ignore
        const castContext = cast.framework.CastContext.getInstance();
        await castContext.requestSession();
        const session = castContext.getCurrentSession();
        if (session) {
          // @ts-ignore
          const contentType = url.includes('.m3u8') ? 'application/x-mpegurl' : 'video/mp4';
          // @ts-ignore
          const mediaInfo = new chrome.cast.media.MediaInfo(url, contentType);
          // @ts-ignore
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = title;
          // @ts-ignore
          const request = new chrome.cast.media.LoadRequest(mediaInfo);
          request.currentTime = videoRef.current?.currentTime || 0;
          await session.loadMedia(request);
          // Pause local video since it's playing on cast device
          if (videoRef.current && isPlaying) {
             videoRef.current.pause();
             setIsPlaying(false);
          }
        }
        return;
      } catch (err: any) {
        if (err !== 'cancel' && err !== 'session_error' && err?.code !== 'cancel') {
           console.error("Cast error:", err?.description || err?.message || err);
        }
        // Don't fallthrough to remote playback because we lost the user gesture context
        return;
      }
    }

    // Fallback to Remote Playback API (e.g. Safari AirPlay, or native Chrome casting without full SDK)
    try {
      // @ts-ignore
      if (videoRef.current && videoRef.current.remote && videoRef.current.remote.prompt) {
        // @ts-ignore
        await videoRef.current.remote.prompt().catch(err => {
          if (err.name === 'NotFoundError') {
             alert("No remote playback devices found on your network.");
          } else if (err.name !== 'NotAllowedError') {
             console.error("Remote Playback error:", err);
          }
        });
      } else {
        alert("Google Cast is not supported on this browser or device.");
      }
    } catch (err) {
      console.error("Remote Playback error:", err);
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, zone: 'left' | 'right') => {
    if (isLocked) return;
    let clientY = 0;
    if ('touches' in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }
    touchStartY.current = clientY;
    activeZone.current = zone;
    touchStartVal.current = zone === 'left' ? brightness : volume;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLocked) return;
    if (!activeZone.current) return;
    let clientY = 0;
    if ('touches' in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }
    const deltaY = touchStartY.current - clientY;
    // 200px swipe = 100% change
    const deltaVal = deltaY / 200; 
    let newVal = Math.max(0, Math.min(1, touchStartVal.current + deltaVal));
    
    if (activeZone.current === 'left') {
      setBrightness(newVal);
      showIndicator('brightness', newVal);
    } else {
      setVolume(newVal);
      if (videoRef.current) videoRef.current.volume = newVal;
      showIndicator('volume', newVal);
    }
  };

  const handleTouchEnd = () => {
    activeZone.current = null;
  };

  const showIndicator = (type: 'brightness'|'volume', value: number) => {
    setSwipeIndicator({type, value});
    if (swipeIndicatorTimeoutRef.current) clearTimeout(swipeIndicatorTimeoutRef.current);
    swipeIndicatorTimeoutRef.current = setTimeout(() => setSwipeIndicator(null), 1000);
  };

  const getObjectFit = () => {
    switch (resizeMode) {
      case 'fill': return 'fill';
      case 'zoom': return 'cover';
      case 'fit':
      default: return 'contain';
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center font-sans ${isHidden ? 'opacity-0 pointer-events-none' : ''}`} style={{ transform: isHidden ? 'translateX(200vw)' : 'none' }} ref={wrapperRef}>
      <style>{`
        video::-webkit-media-controls-start-playback-button,
        video::-internal-media-controls-download-button {
            display: none !important;
            -webkit-appearance: none !important;
            opacity: 0 !important;
        }
        video[poster] {
            object-fit: cover !important;
            background-color: #000000 !important;
        }
        video {
            background: #000000 !important;
            outline: none !important;
        }
      `}</style>
      {/* Video Container */}
      <div 
        className={`w-full h-full relative flex items-center justify-center transition-all duration-300 ${resizeMode === 'fit' ? 'p-4 sm:p-10' : 'p-0'}`}
      >
        <div className={`w-full h-full relative overflow-hidden bg-black ${resizeMode === 'fit' ? 'rounded-xl shadow-2xl' : ''}`}>
           {/* Simulated Brightness Overlay */}
           <div 
             className="absolute inset-0 pointer-events-none z-10" 
             style={{ backgroundColor: `rgba(0,0,0,${1 - brightness})` }}
           />
           
           <video
            ref={videoRef}
             autoPlay
             preload="auto"
             onLoadedMetadata={() => {
                if (initialTime > 0 && !initialTimeApplied.current) {
                  videoRef.current.currentTime = initialTime;
                  initialTimeApplied.current = true;
                }
             }}
             playsInline
             // @ts-ignore
             webkit-playsinline="true"
             disablePictureInPicture={false}
             className="w-full h-full absolute inset-0 z-0"
             style={{ 
               objectFit: getObjectFit(),
               filter: VISUAL_FILTERS.find(f => f.name === visualEnhancer)?.css || 'none'
             }}
             onTimeUpdate={() => {
               const current = videoRef.current?.currentTime || 0;
               setCurrentTime(current);
               if (onProgressUpdate && videoRef.current?.duration) {
                 onProgressUpdate(current, videoRef.current.duration);
               }
             }}
             onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
             onPlay={() => setIsPlaying(true)}
             onPause={() => setIsPlaying(false)}
             onEnded={() => {
               setIsPlaying(false);
               if (onEnded) onEnded();
             }}
             onWaiting={() => setIsLoading(true)}
             onPlaying={() => {
               setIsPlaying(true);
               setIsLoading(false);
             }}
             onCanPlay={() => {
               setIsLoading(false);
               if (videoRef.current && videoRef.current.videoWidth === 0 && videoRef.current.duration > 0) {
                 setAudioOnlyWarning(true);
               } else {
                 setAudioOnlyWarning(false);
               }
             }}
              onError={(e) => {
               console.warn("Video error caught, checking fallback options...");
               if (videoRef.current) {
                 const currentSrc = videoRef.current.currentSrc;
                 
                 if (videoRef.current.error) {
                    setIsLoading(false);
                    if (fallbackIndex < fallbackUrls.length) {
                       handleVideoError();
                    } else {
                       setHasError(true);
                    }
                 } else if (currentSrc) {
                   // Standard soft-reload for intermittent stream issues
                   setTimeout(() => {
                     if (videoRef.current) {
                       videoRef.current.load();
                       const playPromise = videoRef.current.play();
                       if (playPromise !== undefined) {
                         playPromise.catch(err => {
                           if (err.name !== 'AbortError') {
                             console.error("Soft-reload play failed:", err);
                             setIsLoading(false);
                             setHasError(true);
                           }
                         });
                       }
                     }
                   }, 1000);
                 }
               }
             }}
           >
             <source src={url} type="video/mp4" />
           </video>

           {/* Audio Only Warning */}
           <AnimatePresence>
             {(audioOnlyWarning || hasError) && !isLoading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto"
               >
                 <Volume2 className="w-16 h-16 text-white/50 mb-4" />
                 <p className="text-white font-bold text-lg text-center max-w-xs mb-2">
                   {hasError ? 'Video Playback Error' : 'Video Format Unsupported'}
                 </p>
                 <p className="text-white/70 text-sm text-center max-w-sm mb-6 px-4">
                   {hasError 
                     ? 'The video could not be played in the browser due to network issues or an unsupported format. Try opening it in an external player.'
                     : 'Your browser only supports basic web video formats (like H.264). This file might be HEVC, x265, or MKV, which requires an external player to view the video.'
                   }
                 </p>
                 <div className="flex gap-4">
                   <button 
                     onClick={(e) => { 
                       e.stopPropagation(); 
                       onClose();
                     }}
                     className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                   >
                     <ArrowLeft className="w-5 h-5" />
                     Back
                   </button>
                   <button 
                     onClick={(e) => { 
                       e.stopPropagation(); 
                       const intentUrl = `intent://${extractedUrl?.replace(/^https?:\/\//, '')}#Intent;action=android.intent.action.VIEW;scheme=https;type=video/*;end;`;
                       window.location.href = intentUrl;
                     }}
                     className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                   >
                     <Smartphone className="w-5 h-5" />
                     Play in External Player
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Loading Spinner */}
           <AnimatePresence>
             {isLoading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 pointer-events-none"
               >
                 <Loader2 className="w-12 h-12 text-white animate-spin" />
               </motion.div>
             )}
           </AnimatePresence>

           {/* Swipe Zones */}
           <div 
             className="absolute left-0 top-0 bottom-20 w-1/2 z-20 cursor-ns-resize"
             onTouchStart={(e) => handleTouchStart(e, 'left')}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             onMouseDown={(e) => handleTouchStart(e, 'left')}
             onMouseMove={handleTouchMove}
             onMouseUp={handleTouchEnd}
             onMouseLeave={handleTouchEnd}
           />
           <div 
             className="absolute right-0 top-0 bottom-20 w-1/2 z-20 cursor-ns-resize"
             onTouchStart={(e) => handleTouchStart(e, 'right')}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             onMouseDown={(e) => handleTouchStart(e, 'right')}
             onMouseMove={handleTouchMove}
             onMouseUp={handleTouchEnd}
             onMouseLeave={handleTouchEnd}
           />
        </div>
      </div>

      
      {/* Visual Enhancer Modal */}
      <AnimatePresence>
        {showVisualEnhancerPanel && (
          <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center px-4 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
              <button onClick={() => setShowVisualEnhancerPanel(false)} className="text-white p-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white ml-2">Visual Enhancer</h2>
            </div>
            
            {/* Filters Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
              {proUnlockEndTime && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mb-6 flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-lg"><Timer className="w-5 h-5 text-black" /></div>
                  <div>
                    <h3 className="text-amber-500 font-bold text-sm">PRO Unlocked</h3>
                    <p className="text-amber-500/80 text-xs">{Math.floor(proTimeLeft / 60000)}m {Math.floor((proTimeLeft % 60000) / 1000)}s remaining</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {VISUAL_FILTERS.map(filter => (
                  <div 
                    key={filter.name}
                    onClick={() => handleApplyFilter(filter)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all ${visualEnhancer === filter.name ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-transparent hover:border-zinc-500'}`}
                  >
                    <div className="aspect-[16/9] relative">
                      <img src={filter.img} alt={filter.name} className="w-full h-full object-cover" style={{ filter: filter.css }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <span className={`font-bold text-sm ${visualEnhancer === filter.name ? 'text-amber-400' : 'text-white'}`}>{filter.name}</span>
                      </div>
                      
                      {filter.isPro && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 rounded text-[10px] font-black text-white shadow-lg">
                          PRO
                        </div>
                      )}
                      
                      {unlockingFilter === filter.name && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin mb-1" />
                          <span className="text-xs text-amber-500 font-bold">Unlocking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer Apply Button */}
            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md flex justify-center">
               <button 
                 onClick={() => setShowVisualEnhancerPanel(false)}
                 className="w-full max-w-sm py-4 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition"
               >
                 Apply to all & Close
               </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Swipe Indicator Overlay */}
      <AnimatePresence>
        {swipeIndicator && !isLocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/60 backdrop-blur rounded-2xl p-6 flex flex-col items-center gap-4 text-white pointer-events-none"
          >
            {swipeIndicator.type === 'brightness' ? <Sun className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${swipeIndicator.value * 100}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Overlay UI */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className={`p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-auto transition-opacity ${isLocked ? 'opacity-0' : 'opacity-100'} w-full overflow-x-auto gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                 <button 
                   onClick={(e) => { 
                     e.stopPropagation(); 
                     if (!isLocked) onClose(); 
                   }} 
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors mr-2"
                 >
                   <ArrowLeft className="w-6 h-6" />
                 </button>
                 <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md truncate max-w-[200px] sm:max-w-md">{title}</h3>
                 
                 {hasEpisodes && onShowEpisodeSelector && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowEpisodeSelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Play className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold hidden sm:inline">Eps</span>
                    </button>
                 )}
                 {hasLanguages && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowLanguageSelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold hidden sm:inline">Lang</span>
                    </button>
                 )}
                 {hasQualities && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowQualitySelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold hidden sm:inline">Quality</span>
                    </button>
                 )}
                 {onReport && (
                    <button 
                      onClick={(e) => { 
                         e.stopPropagation(); 
                         if (!isLocked) { 
                           onReport(); 
                         } 
                      }}
                      className="bg-white/10 hover:bg-white/20 border-white/10 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border flex items-center gap-2 px-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold hidden sm:inline">Report Error</span>
                    </button>
                 )}
                                  <button 
                   onClick={(e) => { e.stopPropagation(); if (!isLocked) setShowVisualEnhancerPanel(true); }}
                   className={`bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border flex items-center gap-2 px-3 ${visualEnhancer !== 'Original' ? 'bg-amber-500/30 border-amber-500/50' : 'border-white/10'}`}
                 >
                   <Wand2 className={`w-4 h-4 ${visualEnhancer !== 'Original' ? 'text-amber-400' : 'text-gray-400'}`} />
                   <span className="text-xs font-bold hidden sm:inline">Enhance</span>
                 </button>
                 <button 
                   onClick={(e) => { 
                     e.stopPropagation(); 
                     if (!isLocked) {
                       const intentUrl = `intent://${extractedUrl?.replace(/^https?:\/\//, '')}#Intent;action=android.intent.action.VIEW;scheme=https;type=video/*;end;`;
                       window.location.href = intentUrl;
                     }
                   }}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                 >
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold hidden sm:inline">External</span>
                 </button>
                 <button 
                   onClick={handleCast}
                   className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                 >
                   <Cast className="w-4 h-4 text-blue-400" />
                   <span className="text-xs font-bold hidden sm:inline">Cast</span>
                 </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                 <button 
                   onClick={toggleLock} 
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors"
                 >
                   <Lock className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={cycleSleepTimer}
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors relative"
                 >
                   <Timer className="w-5 h-5" />
                   {sleepTimer !== null && (
                     <span className="absolute -bottom-2 -right-2 bg-blue-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{sleepTimer}m</span>
                   )}
                 </button>
                 <button 
                   onClick={toggleLandscapeLock}
                   className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors ${isLandscapeLocked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10'}`}
                   title="Lock to Landscape"
                 >
                   <Smartphone className={`w-5 h-5 transition-transform ${isLandscapeLocked ? 'rotate-90' : ''}`} />
                 </button>
                 <button 
                   onClick={(e) => { 
                     e.stopPropagation(); 
                     if (isLocked) return;
                     if (document.pictureInPictureElement) {
                       setIsHidden(true);
                     } else {
                       onClose(); 
                     }
                   }} 
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
            </div>

            {/* Center Play/Pause Controls & Lock Button */}
            <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8 pointer-events-auto relative">
                {!isLocked ? (
                  <>
                    <button onClick={(e) => skip(-10, e)} className="text-white hover:text-white/80 transition bg-black/40 p-4 rounded-full backdrop-blur">
                      <Rewind className="w-8 h-8" />
                    </button>
                    <button onClick={togglePlay} className="text-white hover:text-white/80 transition bg-black/40 p-6 rounded-full backdrop-blur">
                      {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
                    </button>
                    <button onClick={(e) => skip(10, e)} className="text-white hover:text-white/80 transition bg-black/40 p-4 rounded-full backdrop-blur">
                      <FastForward className="w-8 h-8" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={toggleLock} 
                    className="flex flex-col items-center gap-2 text-white transition bg-black/60 p-6 rounded-3xl backdrop-blur-md hover:bg-black/80"
                  >
                    <Unlock className="w-10 h-10 text-emerald-400" />
                    <span className="font-bold tracking-widest text-sm">TAP TO UNLOCK</span>
                  </button>
                )}
            </div>

            {/* Bottom Bar */}
            <div className={`p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto flex flex-col gap-4 transition-opacity ${isLocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               {/* Time Progress Bar */}
               <div className="flex items-center gap-2">
                 <input 
                   type="range" 
                   min={0} 
                   max={duration || 100} 
                   value={currentTime} 
                   onChange={(e) => {
                     if (videoRef.current && !isLocked) {
                       const time = Number(e.target.value);
                       videoRef.current.currentTime = time;
                       setCurrentTime(time);
                     }
                   }}
                   className="flex-1 h-1.5 sm:h-2 bg-white/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
                 />
               </div>
               
               <div className="flex items-center justify-between">
                 <div className="text-white font-mono text-sm sm:text-base font-bold tracking-wider drop-shadow-md">
                   {formatTime(currentTime)} / {formatTime(duration)}
                 </div>
                 
                 <div className="flex items-center gap-2 sm:gap-4">
                   {/* Brightness Control */}
                   <div className="relative flex items-center justify-center">
                     <AnimatePresence>
                       {showBrightnessSlider && !isLocked && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="absolute bottom-[calc(100%+10px)] bg-black/80 backdrop-blur rounded-2xl p-4 flex flex-col items-center gap-3 z-50 border border-white/10"
                           onClick={(e) => e.stopPropagation()}
                         >
                           <span className="text-white text-xs font-bold">{Math.round(brightness * 100)}%</span>
                           <div className="h-24 w-8 flex items-center justify-center">
                             <input 
                               type="range"
                               min={0.1}
                               max={1}
                               step={0.01}
                               value={brightness}
                               onChange={(e) => setBrightness(Number(e.target.value))}
                               className="w-24 h-1.5 appearance-none bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer transform -rotate-90 origin-center"
                             />
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         if (isLocked) return;
                         setShowBrightnessSlider(!showBrightnessSlider);
                         setShowVolumeSlider(false);
                       }}
                       className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center justify-center"
                     >
                       <Sun className="w-5 h-5" />
                     </button>
                   </div>

                   {/* Volume Control */}
                   <div className="relative flex items-center justify-center">
                     <AnimatePresence>
                       {showVolumeSlider && !isLocked && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="absolute bottom-[calc(100%+10px)] bg-black/80 backdrop-blur rounded-2xl p-4 flex flex-col items-center gap-3 z-50 border border-white/10"
                           onClick={(e) => e.stopPropagation()}
                         >
                           <span className="text-white text-xs font-bold">{Math.round(volume * 100)}%</span>
                           <div className="h-24 w-8 flex items-center justify-center">
                             <input 
                               type="range"
                               min={0}
                               max={1}
                               step={0.01}
                               value={volume}
                               onChange={(e) => {
                                 const val = Number(e.target.value);
                                 setVolume(val);
                                 setIsMuted(val === 0);
                                 if (videoRef.current) videoRef.current.volume = val;
                               }}
                               className="w-24 h-1.5 appearance-none bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer transform -rotate-90 origin-center"
                             />
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         if (isLocked) return;
                         setShowVolumeSlider(!showVolumeSlider);
                         setShowBrightnessSlider(false);
                       }}
                       className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center justify-center"
                     >
                       {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                     </button>
                   </div>
                   
                   <button 
                     onClick={cyclePlaybackSpeed}
                     className="text-white hover:text-white/80 transition bg-white/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur text-sm font-bold tracking-wider"
                   >
                     {playbackSpeed}x
                   </button>
                   
                   <button 
                     onClick={handleDownload}
                     className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center justify-center"
                     title="Download Video"
                   >
                     <Download className="w-5 h-5" />
                   </button>
                   
                   <button 
                     onClick={togglePiP}
                     className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center justify-center"
                   >
                     <MonitorPlay className="w-5 h-5" />
                   </button>

                   <button 
                     onClick={cycleResizeMode}
                     className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center gap-2"
                   >
                     <Maximize className="w-5 h-5" />
                     <span className="text-xs font-bold hidden sm:inline uppercase tracking-widest">{resizeMode}</span>
                   </button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


