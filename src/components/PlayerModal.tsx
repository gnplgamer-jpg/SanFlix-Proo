import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download, ExternalLink, X, Lock, Zap, Youtube, Star, ShieldAlert, MonitorPlay, Smartphone, Globe, Settings, ArrowLeft, Calendar, Share2, AlertCircle, CheckCircle } from 'lucide-react';
import { db, collection, getDocs, query, where, limit, addDoc } from '../firebase';
import { MovieRail } from './MovieRail';
import { ReportModal } from './ReportModal';

interface PlayerModalProps {
  movie: any;
  onClose: () => void;
  allContent?: any[];
  onSelectMovie?: (movie: any) => void;
  onPlayVideo?: (url: string, movie: any) => void;
    isUnlocked?: boolean;
  onRequireUnlock?: () => void;
}

export function PlayerModal({ movie, onClose, allContent = [], onSelectMovie, onPlayVideo, isUnlocked = false, onRequireUnlock }: PlayerModalProps) {
  const [pendingActionUrl, setPendingActionUrl] = useState<string | null>(null);
  const [pendingActionType, setPendingActionType] = useState<'play' | 'download'>('play');
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);
  const [showPlayerChoice, setShowPlayerChoice] = useState(false);
  const [fetchedCast, setFetchedCast] = useState<any[]>([]);
  const [fetchedCrew, setFetchedCrew] = useState<any[]>([]);
  const [reportingData, setReportingData] = useState<{ isOpen: boolean, episodeTitle?: string, episodeIdx?: number, failedUrl: string } | null>(null);
  const [adProduct, setAdProduct] = useState<any>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  useEffect(() => {
    const movieId = movie?.id || movie?.firebase_id;
    if (movieId) {
      const saved = localStorage.getItem('SANFLIX_PROGRESS');
      if (saved) {
        const progressData = JSON.parse(saved);
        if (progressData[movieId] && progressData[movieId].url) {
          setLastUrl(progressData[movieId].url);
        }
      }
    }
  }, [movie]);

  useEffect(() => {
    let adInterval: any;
    const fetchAd = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Set initial random product
          setAdProduct(products[Math.floor(Math.random() * products.length)]);
          
          if (products.length > 1) {
            adInterval = setInterval(() => {
              setAdProduct(products[Math.floor(Math.random() * products.length)]);
            }, 5000);
          }
        }
      } catch (e) {
        console.error("Error fetching ad product:", e);
      }
    };
    fetchAd();

    return () => {
      if (adInterval) clearInterval(adInterval);
    };
  }, []);
  const relatedContent = useMemo(() => {
    if (!allContent || allContent.length === 0 || !movie) return [];
    
    const currentCategories = movie.mapped_category_rail ? String(movie.mapped_category_rail).split(/[,/|]+/).map((c: string) => String(c).trim().toLowerCase()).filter(Boolean) : [];
    
    let related = allContent
      .filter((m: any) => (m.firebase_id || m.id) !== (movie.firebase_id || movie.id))
      .map((m: any) => {
        let score = 0;
        const targetCategories = m.mapped_category_rail ? String(m.mapped_category_rail).split(/[,/|]+/).map((c: string) => String(c).trim().toLowerCase()).filter(Boolean) : [];
        
        // High priority: Exact array/string match
        if (movie.mapped_category_rail === m.mapped_category_rail) {
          score += 50;
        }
        
        // Medium priority: Intersection of genre tags
        const commonTags = currentCategories.filter((tag: string) => targetCategories.includes(tag));
        score += commonTags.length * 20;

        // Low priority: Same media format if no tags match
        if (m.media_layout_format === movie.media_layout_format) {
          score += 5;
        }

        return { ...m, matchScore: score };
      })
      .filter((m: any) => m.matchScore > 0)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);

    // Fallback logic if there aren't enough matches: return items of same layout format
    if (related.length < 10) {
      const existingIds = new Set(related.map((r: any) => r.id || r.firebase_id));
      const layoutFallbacks = allContent
        .filter((m: any) => 
           (m.firebase_id || m.id) !== (movie.firebase_id || movie.id) && 
           !existingIds.has(m.id || m.firebase_id) && 
           m.media_layout_format === movie.media_layout_format
        );
        
      const anyFallbacks = allContent
        .filter((m: any) => 
           (m.firebase_id || m.id) !== (movie.firebase_id || movie.id) && 
           !existingIds.has(m.id || m.firebase_id)
        );

      const fallbacks = layoutFallbacks.length > 5 ? layoutFallbacks : anyFallbacks;

      const randomFallbacks = fallbacks
        // Shuffle fallbacks slightly for variety
        .sort(() => 0.5 - Math.random())
        .slice(0, 10 - related.length);
        
      related = [...related, ...randomFallbacks];
    }
    
    return related.slice(0, 10);
  }, [allContent, movie]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const adultProviders = ["ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films", "ADULT"];
  const isAdultCategory = movie.mapped_category_rail ? adultProviders.some(p => String(movie.mapped_category_rail).toUpperCase().includes(String(p).toUpperCase())) : false;

  // Reset states when movie changes
  useEffect(() => {
    setShowAgeWarning(false);
    
    setShowTrailer(false);
    setPendingActionUrl(null);
    setFetchedCast([]);
    setFetchedCrew([]);
    if (scrollRef.current) {
       scrollRef.current.scrollTop = 0;
    }
    
    // Fetch dynamic cast from TMDB if tmdb_id exists
    if (movie.tmdb_id) {
      fetch(`/api/meta-data/details/${encodeURIComponent(movie.tmdb_id.toString().trim())}?type=${movie.eps_count > 0 || (movie.episodes && movie.episodes.length > 0) ? 'tv' : 'movie'}`)
        .then(r => r.json())
        .then(data => {
            if (data?.credits?.cast) {
                setFetchedCast(data.credits.cast.slice(0, 15));
            }
            if (data?.credits?.crew) {
                setFetchedCrew(data.credits.crew.filter((c: any) => c.job === 'Director' || c.job === 'Producer' || c.job === 'Writer').slice(0, 5));
            }
        })
        .catch(err => console.error("Error fetching TMDB cast:", err));
    }
  }, [movie]);
  
  const handleActionClick = (url: string, type: 'play' | 'download' = 'play') => {
    if (!url) {
      return;
    }
    setPendingActionUrl(url);
    setPendingActionType(type);
    
    if (isAdultCategory) {
      setShowAgeWarning(true);
    } else {
      checkUnlockAndProceed(url);
    }
  };

  const checkUnlockAndProceed = (url: string) => {
    setShowAgeWarning(false);
    if (!isUnlocked && onRequireUnlock) {
      onRequireUnlock();
    } else {
      proceedToPlayer(url);
    }
  };

  const executePlay = (url: string | null | undefined, type: string) => {
    if (!url) return;
    // If user pasted an iframe tag, extract the src URL
    let finalUrl = url;
    if (url.includes('<iframe') && url.includes('src="')) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }

    if (type === 'In-App Web Player' || type === 'Direct Streaming' || finalUrl.includes('youtube.com/embed/') || finalUrl.includes('youtu.be/')) {
       // Convert youtu.be to embed if needed
       let embedTarget = finalUrl;
       if (finalUrl.includes('youtu.be/')) {
           const videoId = finalUrl.split('.be/')[1]?.split('?')[0];
           if (videoId) embedTarget = `https://www.youtube.com/embed/${videoId}`;
       }
       if (!embedTarget.includes('youtube.com') && !embedTarget.includes('youtu.be') && onPlayVideo) {
         onPlayVideo(embedTarget, movie);
       } else {
         setEmbeddedUrl(embedTarget);
       }
       return;
    }

    if (type === 'External Browser') {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      const intentUrl = `intent://${finalUrl.replace(/^https?:\/\//, '')}#Intent;action=android.intent.action.VIEW;scheme=https;type=video/*;end;`;
      window.location.href = intentUrl;
    }
  };

  const proceedToPlayer = (url?: string) => {
    const targetUrl = url || pendingActionUrl;
    if (!targetUrl) return;

    // Notify native Android app if available
    if (typeof window !== 'undefined' && (window as any).SanFlixNativeBridge && (window as any).SanFlixNativeBridge.sendNotification) {
       (window as any).SanFlixNativeBridge.sendNotification(
           "SanFlix Stream", 
           movie?.title ? `Starting: ${movie.title}` : "Premium stream unlocked."
       );
    }
    
    

    if (pendingActionType === 'download') {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = movie?.title || 'download';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setPendingActionUrl(null);
      setPendingActionType('play');
      return;
    }

    let streamType = movie?.stream_type || 'Auto-Detect';
    let finalUrl = targetUrl;
    
    // Strip ?download parameter if we are trying to stream it (otherwise browser <video> gets stuck due to Content-Disposition: attachment)
    if (pendingActionType === 'play' && finalUrl.includes('pixeldrain') && finalUrl.includes('?download')) {
       finalUrl = finalUrl.replace('?download', '');
    }

    // Auto-detect direct stream URLs
    if (streamType === 'Auto-Detect' && (finalUrl.includes('drive.google.com') || finalUrl.includes('pixeldrain') || finalUrl.includes('.mp4') || finalUrl.includes('.mkv') || finalUrl.includes('.webm'))) {
       streamType = 'In-App Web Player';
    }

    if (movie?.is_direct_streaming) {
        streamType = 'In-App Web Player';
        // If the URL matches the primary streaming link, override with the first language URL
        if (movie.language_urls && movie.language_urls.length > 0 && targetUrl === movie.streaming_link_1 && movie.language_urls[0].url) {
            finalUrl = movie.language_urls[0].url;
        }
    }

    if (streamType === 'User Choice') {
      setPendingActionUrl(finalUrl);
      setShowPlayerChoice(true);
      return;
    }

    executePlay(finalUrl, streamType);
  };

  useEffect(() => {
    (window as any).proceedToPlayer = proceedToPlayer;
    return () => {
      delete (window as any).proceedToPlayer;
    };
  }, [pendingActionUrl, pendingActionType, movie]);
  
  const watchTrailer = () => {
    if (movie.trailer_id) {
       setShowTrailer(true);
    } else {
       alert("No trailer ID configured");
    }
  };

  const handleShare = async () => {
    const movieId = movie.firebase_id || movie.id;
    const movieTitle = movie.title || '';

    const text = "Watch '" + movieTitle + "' on SANFLIX PRO!\n\nhttps://ais-dev-npfy56f3b2r7xxg3atrdkd-822851301981.asia-east1.run.app/?id=" + movieId;

    // Check if running inside Android WebView app via JS bridge 'AndroidShare'
    if (typeof window !== 'undefined' && (window as any).AndroidShare && typeof (window as any).AndroidShare.triggerShare === 'function') {
      try {
        (window as any).AndroidShare.triggerShare(movieId, text);
        return;
      } catch (e) {
        console.error("Error invoking AndroidShare bridge", e);
      }
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: movieTitle,
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Share link copied to clipboard!");
      }
    } catch (e) {
      console.log("Error sharing", e);
    }
  };

  const metadataCast = movie.cast_crew ? (Array.isArray(movie.cast_crew) ? movie.cast_crew : String(movie.cast_crew).split(','))
    .map((c: string) => ({ name: c.trim(), character: 'Cast' }))
    .filter((c: any) => c.name && String(c.name).toLowerCase() !== "cast & crew" && String(c.name).toLowerCase() !== "cast" && String(c.name).toLowerCase() !== "crew") : [];
  
  // They only want original cast (not fake/blank). If it lacks a photo and came from TMDB, we skip it.
  const displayCast = (fetchedCast.length > 0 ? fetchedCast : metadataCast).filter((c: any) => c.profile_path);
  const validCrew = fetchedCrew.filter((c: any) => c.profile_path);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end lg:justify-center items-center p-0 lg:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-4xl bg-[#09090B] rounded-t-3xl lg:rounded-3xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md">
          <X className="w-5 h-5"/>
        </button>
        
        <div ref={scrollRef} className="overflow-y-auto hide-scrollbar pb-8">
          {/* Header Image */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 shrink-0 bg-zinc-900 border-b border-zinc-800">
            <img 
              src={movie.backdrop_url || movie.poster_url || movie.imageUrl} 
              className="w-full h-full object-cover opacity-60" 
              alt={movie.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end gap-6">
              <div className="hidden sm:block w-32 h-48 rounded-xl overflow-hidden shrink-0 border-2 border-zinc-800 shadow-2xl">
                <img src={movie.poster_url || movie.imageUrl} className="w-full h-full object-cover" alt="Poster" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/10">
                    {movie.media_layout_format || 'Movie'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-zinc-300">
                    {movie.release_date ? String(movie.release_date).split('-')[0] : 'N/A'}
                  </span>
                  {movie.rating && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400" /> {movie.rating}
                    </span>
                  )}
                  {movie.ad_gate && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">
                      18+ Restricted
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">{movie.title}</h2>
                <div className="text-sm text-zinc-400 flex flex-wrap items-center gap-1.5">
                  {movie.mapped_category_rail}
                  {(movie.season_count > 0 || movie.eps_count > 0) && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      {movie.season_count > 0 ? `${movie.season_count} Seasons` : ''} 
                      {movie.eps_count > 0 ? `${movie.eps_count} Episodes` : ''}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {(!movie.episodes || movie.episodes.length === 0 || !movie.episodes[0].url) && movie.streaming_link_1 && (
                  <button 
                    onClick={() => handleActionClick(lastUrl || movie.streaming_link_1)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" /> {lastUrl ? 'Resume' : 'Watch Now'}
                  </button>
                )}
                {(!movie.episodes || movie.episodes.length === 0 || !movie.episodes[0].url) && movie.streaming_link_1 && !(movie.download_link_480p || movie.download_link_720p || movie.download_link_1080p || movie.download_link_hdr || movie.download_link) && (
                  <button 
                     onClick={() => handleActionClick(movie.streaming_link_1, 'download')}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors border border-zinc-700"
                  >
                    <Download className="w-5 h-5 text-blue-500" /> Download
                  </button>
                )}
                {movie.trailer_id && (
                  <button 
                    onClick={watchTrailer}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors border border-zinc-700"
                  >
                    <Youtube className="w-5 h-5 text-red-500" /> Trailer
                  </button>
                )}
                {(!movie.episodes || movie.episodes.length === 0 || !movie.episodes[0].url) && !movie.streaming_link_1 && !movie.trailer_id && (
                  <button 
                    disabled
                    className="flex-1 bg-zinc-800/50 text-zinc-500 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-zinc-800 cursor-not-allowed"
                  >
                    <Calendar className="w-5 h-5" /> Coming Soon
                  </button>
                )}
                
                <button 
                  onClick={() => setReportingData({ isOpen: true, failedUrl: movie.streaming_link_1 || (movie.episodes && movie.episodes.length > 0 ? movie.episodes[0].url : '') })}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 border-red-500/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border overflow-hidden relative transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" /> Report Broken Link
                </button>
                <motion.button 
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 15px rgba(16, 185, 129, 0.4)", "0px 0px 0px rgba(16, 185, 129, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-emerald-500/30 overflow-hidden relative"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Share2 className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <span>Share</span>
                </motion.button>
              </div>

              {/* Download Options */}
              {((movie.download_link_480p || movie.download_link_720p || movie.download_link_1080p || movie.download_link_hdr) || movie.download_link) && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Download Options</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {movie.download_link_480p && (
                       <button onClick={() => handleActionClick(movie.download_link_480p, 'download')} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                         <Download className="w-4 h-4" /> 480p
                       </button>
                    )}
                    {movie.download_link_720p && (
                       <button onClick={() => handleActionClick(movie.download_link_720p, 'download')} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                         <Download className="w-4 h-4" /> 720p
                       </button>
                    )}
                    {movie.download_link_1080p && (
                       <button onClick={() => handleActionClick(movie.download_link_1080p, 'download')} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                         <Download className="w-4 h-4" /> 1080p
                       </button>
                    )}
                    {movie.download_link_hdr && (
                       <button onClick={() => handleActionClick(movie.download_link_hdr, 'download')} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                         <Download className="w-4 h-4" /> 4K HDR
                       </button>
                    )}
                    {(!movie.download_link_480p && !movie.download_link_720p && !movie.download_link_1080p && !movie.download_link_hdr && movie.download_link) && (
                       <button onClick={() => handleActionClick(movie.download_link, 'download')} className="col-span-2 sm:col-span-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                         <Download className="w-4 h-4" /> Download File
                       </button>
                    )}
                  </div>
                </div>
              )}

              {movie.episodes && movie.episodes.length > 0 && movie.episodes.filter((e: any) => e.url).length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Episodes</h3>
                  <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
                    {movie.episodes.filter((e: any) => e.url).map((ep: any, idx: number) => (
                      <div key={idx} className="shrink-0 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl flex flex-col gap-3 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-sm font-bold text-white line-clamp-1" title={ep.title}>{ep.title}</span>
                        </div>
                        <div className="flex gap-2 w-full mt-auto">
                          <button
                            onClick={() => handleActionClick(ep.url)}
                            className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                          >
                             <Play className="w-3 h-3" /> Play
                          </button>
                          {ep.download_url ? (
                            <button
                              onClick={() => handleActionClick(ep.download_url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> Get
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActionClick(ep.url, 'download')}
                              className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                            >
                               <Download className="w-3 h-3" /> Get
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {movie.synopsis || "No detailed synopsis available for this title."}
                </p>
              </div>

              {/* Ad Banner */}
              {adProduct && (
                <a href={adProduct.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden border border-red-500/30 group my-4">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-md shadow-red-900/50 uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" /> SPONSORED
                  </div>
                  <div className="flex bg-zinc-900/80 backdrop-blur-sm relative z-0">
                    <div className="w-24 h-24 shrink-0 bg-white">
                      <img src={adProduct.imageUrl || 'https://via.placeholder.com/150'} alt={adProduct.title} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="p-3 flex flex-col justify-center flex-1">
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">{adProduct.title}</h4>
                      {adProduct.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-[10px] text-zinc-400">{adProduct.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        {adProduct.price && <span className="text-xs font-bold text-red-400">{adProduct.price}</span>}
                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/10 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
                </a>
              )}

              {/* Cast & Crew */}
              {(displayCast.length > 0 || validCrew.length > 0) && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Cast & Crew</h3>
                  <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                    {validCrew.map((crew: any, idx: number) => (
                      <div key={`crew-${idx}`} className="flex flex-col items-center min-w-[80px]">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-red-900/50 mb-2 flex-shrink-0 relative flex items-center justify-center">
                          {crew.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${crew.profile_path}`} alt={crew.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : null}
                        </div>
                        <p className="text-xs font-bold text-white text-center w-full truncate px-1">{crew.name}</p>
                        <p className="text-[10px] text-[#8A8A93] text-center w-full truncate px-1">{crew.job}</p>
                      </div>
                    ))}
                    
                    {displayCast.map((cast: any, idx: number) => (
                      <div key={`cast-${idx}`} className="flex flex-col items-center min-w-[80px]">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-800/80 mb-2 flex-shrink-0 relative flex items-center justify-center">
                          {cast.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`} alt={cast.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : null}
                        </div>
                        <p className="text-xs font-bold text-white text-center w-full truncate px-1">{cast.name}</p>
                        <p className="text-[10px] text-[#8A8A93] text-center w-full truncate px-1">{cast.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Alternate Links */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-3">Alternate Servers</h3>
                <div className="space-y-2">
                  {movie.streaming_link_2 && (
                    <button 
                      onClick={() => handleActionClick(movie.streaming_link_2)}
                      className="w-full bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-500" /> Alternate Server 1
                      </span>
                    </button>
                  )}
                  {movie.streaming_link_3 && (
                    <button 
                      onClick={() => handleActionClick(movie.streaming_link_3)}
                      className="w-full bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-purple-500" /> Mirror Server
                      </span>
                    </button>
                  )}
                  {!movie.streaming_link_2 && !movie.streaming_link_3 && (
                    <p className="text-xs text-zinc-500">No alternate servers available.</p>
                  )}
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Related Content - Full Width at Bottom */}
          <div className="px-6 sm:px-8 pb-8 relative">
            <h3 className="text-sm font-black text-white tracking-wide mb-2 uppercase border-l-4 border-red-500 pl-2">More Like This</h3>
            {relatedContent.length > 0 ? (
              <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x pb-4 pt-2 cursor-grab active:cursor-grabbing">
                {relatedContent.map((related: any, idx: number) => (
                  <div 
                    key={`${related.id || related.firebase_id || 'related'}-${idx}`}
                    onClick={() => {
                      if (onSelectMovie) onSelectMovie(related);
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="w-28 sm:w-32 md:w-36 lg:w-40 shrink-0 snap-start group flex flex-col"
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-transparent shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] z-0">
                      <img src={related.poster_url || related.imageUrl || 'https://via.placeholder.com/300x450'} alt={related.title || 'Movie'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/20 group-hover:via-black/10 transition-colors duration-300" />
                      
                      <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-white/20 uppercase tracking-wider backdrop-blur-sm">
                        {related.ad_gate ? 'VIP' : '⚡ HD'}
                      </div>
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-75 group-hover:scale-100 transition-transform">
                            <i className="fa-solid fa-play text-white ml-0.5 text-sm"></i>
                         </div>
                      </div>
                    </div>
                    <h3 className="text-[11px] sm:text-xs font-semibold leading-tight truncate px-1 text-zinc-300 group-hover:text-amber-400 transition-colors">
                      {related.title || 'Untitled'}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">No related content available right now.</p>
            )}
          </div>

        </div>
      </motion.div>

      {/* 18+ Age Warning */}
      <AnimatePresence>
        {showAgeWarning && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm bg-zinc-900 rounded-3xl relative z-10 overflow-hidden border border-red-500/20 shadow-2xl"
              >
                <div className="p-8 text-center pb-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider text-red-500">18+ Adult Content</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    This content contains themes intended exclusively for audiences 18 years and older. Viewer discretion is advised.
                  </p>
                </div>
                <div className="flex border-t border-zinc-800">
                   <button 
                     onClick={() => setShowAgeWarning(false)}
                     className="flex-1 py-4 text-zinc-400 font-bold hover:bg-white/5 transition"
                   >
                     Go Back
                   </button>
                   <div className="w-px bg-zinc-800" />
                   <button 
                     onClick={() => checkUnlockAndProceed(pendingActionUrl!)}
                     className="flex-1 py-4 text-red-500 font-bold hover:bg-white/5 transition"
                   >
                     I am 18+
                   </button>
                </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>





      {/* User Choice Modal */}
      <AnimatePresence>
        {showPlayerChoice && pendingActionUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowPlayerChoice(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-sm bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <h3 className="text-xl font-bold text-white text-center mb-6">Choose Player</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => { setShowPlayerChoice(false); executePlay(pendingActionUrl, 'In-App Web Player'); }}
                  className="w-full bg-zinc-800/80 hover:bg-zinc-700 text-white py-4 rounded-xl font-bold text-[14px] transition flex items-center justify-center gap-2"
                >
                  <MonitorPlay className="w-5 h-5 text-red-500" />
                  In-App Web Player
                </button>
                
                <button 
                  onClick={() => { setShowPlayerChoice(false); executePlay(pendingActionUrl, 'External App'); }}
                  className="w-full bg-zinc-800/80 hover:bg-zinc-700 text-white py-4 rounded-xl font-bold text-[14px] transition flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  External App (MX Player / VLC)
                </button>
                
                <button 
                  onClick={() => { setShowPlayerChoice(false); executePlay(pendingActionUrl, 'External Browser'); }}
                  className="w-full bg-zinc-800/80 hover:bg-zinc-700 text-white py-4 rounded-xl font-bold text-[14px] transition flex items-center justify-center gap-2"
                >
                  <Globe className="w-5 h-5 text-purple-500" />
                  External Browser (Chrome)
                </button>
              </div>

              <button 
                onClick={() => setShowPlayerChoice(false)}
                className="w-full mt-4 text-zinc-500 hover:text-white py-2 text-sm font-semibold transition"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Trailer Overlay */}
      <AnimatePresence>
        {showTrailer && movie.trailer_id && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                 <button 
                   onClick={() => setShowTrailer(false)} 
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md truncate pr-4">{`${movie.title} - Official Trailer`}</h3>
              </div>
              <button 
                onClick={() => setShowTrailer(false)} 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center">
                <div className="w-full aspect-video max-h-[80vh]">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailer_id}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full border-0 rounded-xl shadow-2xl bg-zinc-900"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Player Overlay */}
      <AnimatePresence>
        {embeddedUrl && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                 <button 
                   onClick={() => setEmbeddedUrl(null)} 
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md truncate">{`${movie.title} - Now Playing`}</h3>
              </div>
              <button 
                onClick={() => setEmbeddedUrl(null)} 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center relative">
                <div className="w-full aspect-video max-h-[80vh]">
                  <iframe
                    src={embeddedUrl}
                    className="w-full h-full border-0 rounded-xl shadow-2xl bg-zinc-900 relative z-0"
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                  />
                </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <ReportModal
        isOpen={!!reportingData?.isOpen}
        onClose={() => setReportingData(null)}
        title={reportingData?.episodeTitle ? `Report Episode: ${reportingData.episodeTitle}` : 'Report Broken Link'}
        onSubmit={async (description) => {
          if (!reportingData) return;
          const payload = {
            movieId: movie?.firebase_id || movie?.id || 'unknown',
            movieTitle: movie?.title || 'Unknown',
            episodeTitle: reportingData.episodeTitle || '',
            episodeIdx: reportingData.episodeIdx !== undefined ? reportingData.episodeIdx : null,
            failedUrl: reportingData.failedUrl || '',
            description: description || '',
            timestamp: new Date().toISOString(),
            resolved: false
          };
          Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
          await addDoc(collection(db, 'SanFlix_Reports'), payload);
        }}
      />
    </div>
  );
}

