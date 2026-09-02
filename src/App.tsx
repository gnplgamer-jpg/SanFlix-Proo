import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { UnityAds } from "capacitor-unity-ads";
import { AdMob } from "@capacitor-community/admob";
import { AD_CONFIG } from "./config/ads";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Play, Clock, Star, Tv, Heart, History, ChevronLeft, ChevronDown, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { TopHeader } from './components/TopHeader';
import { GamesHub } from './components/GamesHub';
import { BottomNav } from './components/BottomNav';
import { AppOpenAd } from "./components/AppOpenAd";
import { AdminPanel } from './components/AdminPanel';
import { Shop } from './components/Shop';
import { CartScreen } from './components/CartScreen';
import { ProfileHub } from './components/ProfileHub';
import { Discover } from './components/Discover';
import { TvShows } from './components/TvShows';
import { Movies } from './components/Movies';
import { PlayerModal } from './components/PlayerModal';
import { DirectVideoPlayer } from './components/DirectVideoPlayer';
import { ReportModal } from './components/ReportModal';
import { NoticeModal } from './components/NoticeModal';
import { RequestModal } from './components/RequestModal';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdPlayer } from './components/AdPlayer';
import { MovieRail } from './components/MovieRail';
import { ActressRail, predefinedActresses } from './components/ActressRail';
import { LiveTvRail } from './components/LiveTvRail';
import { ChatBot } from './components/ChatBot';

const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

  useEffect(() => {
    if (localStorage.getItem('SANFLIX_BANNED') === 'true') {
       alert("Your account is permanently banned for cheating.");
       
       return;
    }
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

import { BlurImage } from './components/BlurImage';
import { TrendingVideos } from './components/TrendingVideos';
import { LiveTvScreen } from './components/LiveTvScreen';
import { UnlockModal } from './components/UnlockModal';
import { SpinnerPage } from './components/SpinnerPage';
import { Globe, Settings, X, Sparkles, Bot, ExternalLink } from 'lucide-react';
import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc, getDoc, updateDoc } from './firebase';
import { useCoinSystem } from './useCoinSystem';
import { movies as staticMovies } from './data';

const safeLower = (val: any) => String(val || undefined).toLowerCase();

const defaultStaticCategories = ['All', 'Premium', 'Recent', 'Bhojpuri', 'Romantic', 'Horror', 'Action', 'Thriller', 'Sci-Fi', 'Crime', 'Comedy', 'Anime', 'Old is gold', '🔥 18+ Hub'];

export default function App() {
  useEffect(() => {
    const initUnityAds = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Initialize AdMob
          
          // Initialize AdMob and AppOpen
          await AdMob.initialize({});
          try {
            await AdMob.loadAppOpen({ adId: AD_CONFIG.admob.appOpen });
            await AdMob.showAppOpen();
          } catch(e) { console.error("AppOpen Error", e); }


          // Initialize Unity Ads
          // Game ID should be your actual Unity Game ID
          await UnityAds.initialize({ gameId: AD_CONFIG.unity.gameId, testMode: false });
        }
      } catch (e) {
        console.error("UnityAds Init Error", e);
      }
    };
    initUnityAds();
  }, []);


  const isAdminRoute = new URLSearchParams(window.location.search).get('adminMode') === 'true';

  if (isAdminRoute) {
    return (
      <div className="w-full h-screen bg-zinc-950 text-white overflow-y-auto">
        <AdminPanel />
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoProduct, setPromoProduct] = useState<any>(null);
  const [showPromo, setShowPromo] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          isGuest: false,
          photoURL: firebaseUser.photoURL
        };
        setUser(user);
        localStorage.setItem('sanflix_user', JSON.stringify(user));
        
        // Fetch user data from firestore
        try {
           
           
           // Ensure user is in database for admin panel
           await setDoc(doc(db, 'users', firebaseUser.uid), {
             uid: firebaseUser.uid,
             displayName: firebaseUser.displayName || 'User',
             email: firebaseUser.email,
             photoURL: firebaseUser.photoURL,
             lastLogin: new Date().toISOString()
           }, { merge: true });

           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
           if (userDoc.exists()) {
             const data = userDoc.data();
             if (data.myListIds) {
               setMyListIds(data.myListIds);
               localStorage.setItem('SANFLIX_MYLIST', JSON.stringify(data.myListIds));
             }
           }
        } catch(e) {
           console.error("Failed to fetch user cloud save", e);
        }

      } else {
        const savedUser = localStorage.getItem('sanflix_user');
        if (savedUser) {
          try {
             const parsed = JSON.parse(savedUser);
             if (parsed.isGuest) {
               setUser(parsed);
               return;
             }
          } catch (e) {
             console.error(e);
          }
        }
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: any[] = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        if (productsList.length > 0 && !sessionStorage.getItem('promo_shown')) {
          sessionStorage.setItem('promo_shown', 'true');
          const randomProduct = productsList[Math.floor(Math.random() * productsList.length)];
          setPromoProduct(randomProduct);
          setShowPromo(true);
          
          setTimeout(() => {
            setShowPromo(false);
          }, 5000);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    setTimeout(() => {
      fetchPromo();
    }, 1500);
  }, []);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumTrialMode, setPremiumTrialMode] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [fraudWarning, setFraudWarning] = useState<{message: string, count: number} | null>(null);
  const [pendingMovie, setPendingMovie] = useState<any | null>(null);
  const [showSpinnerPage, setShowSpinnerPage] = useState(false);
  const [unlockingMovie, setUnlockingMovie] = useState<any | null>(null);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [trendingSearches, setTrendingSearches] = useState<{ id: string, query: string }[]>([]);
  
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isLightMode, setIsLightMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { coins, isUnlocked, unlockedContent, unlockMovie, addCoins } = useCoinSystem(user);


  const [isChatOpen, setIsChatOpen] = useState(false);

  const CURRENT_APP_VERSION = '1.0.0';
  const [appUpdateData, setAppUpdateData] = useState<{ version: string; url: string; changelog: string; } | null>(null);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'SanFlix_Config', 'app_update'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        if (data.version && data.version !== CURRENT_APP_VERSION) {
          // Check if this version is technically "newer". For now, just inequality is fine, or simple check.
          if (data.version.trim() !== '') {
            setAppUpdateData(data);
          }
        }
      }
    });
    return () => unsub();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
    
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  // Profile settings state
  const [isPHubEnabled, setIsPHubEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_PHUB_ENABLED');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isAdultEnabled, setIsAdultEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_ADULT_ENABLED');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  const [batterySaver, setBatterySaver] = useState(() => {
    return localStorage.getItem('SANFLIX_BATTERY_SAVER') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('SANFLIX_ADULT_ENABLED', JSON.stringify(isAdultEnabled));
  }, [isAdultEnabled]);

  useEffect(() => {
    localStorage.setItem('SANFLIX_BATTERY_SAVER', batterySaver ? 'true' : 'false');
  }, [batterySaver]);

  // Battery Status API for auto-toggle
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          if (battery.level <= 0.2 && !battery.charging) {
            setBatterySaver(true);
          }
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
        return () => {
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingchange', updateBattery);
        };
      }).catch(() => {});
    }
  }, []);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [moviesList, setMoviesList] = useState<any[]>([]);

  // Continue Watching & My List state
  const [continueWatchingIds, setContinueWatchingIds] = useState<string[]>([]);
  const [myListIds, setMyListIds] = useState<string[]>([]);

  // Global Video Player State for PiP Persistence
  const [globalVideo, setGlobalVideo] = useState<{
    url: string;
    movie: any;
    showLanguageSelector: boolean;
    showQualitySelector: boolean;
    showEpisodeSelector: boolean;
    fallbackUrls?: string[];
    initialTime?: number;
  } | null>(null);
  const [reportingData, setReportingData] = useState<{ isOpen: boolean, movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number } | null>(null);

  const reportBrokenLink = async (movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number) => {
    setReportingData({ isOpen: true, movieId, movieTitle, failedUrl, episodeTitle, episodeIdx });
  };

  const getFallbacks = (url: string, movie: any) => {
    if (!movie) return [];
    if (url === movie.streaming_link_1) {
      return [movie.streaming_link_2, movie.streaming_link_3, movie.streaming_link_4].filter(Boolean);
    }
    if (movie.episodes) {
      const ep = movie.episodes.find((e: any) => e.url === url);
      if (ep) {
         return [ep.url_2, ep.url_3, ep.url_4].filter(Boolean);
      }
    }
    return [];
  };
  
  const [nextVideoCountdown, setNextVideoCountdown] = useState<{
    movie: any;
    timeLeft: number;
    nextEpisode?: any;
  } | null>(null);

      
  // Next Video Countdown effect
  const [appError, setAppError] = useState<Error | null>(null);

  // --- LAYERED BACK NAVIGATION LOGIC ---
  const stateRefs = useRef({
    globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab, unlockingMovie
  });
  
  useEffect(() => {
    stateRefs.current = {
      globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab, unlockingMovie
    };
  }, [globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab, unlockingMovie]);

  useEffect(() => {
    let lastBackPress = 0;
    
    const handleBackButton = () => {
      const state = stateRefs.current;
      
      // Layer 1: Video Player
      if (state.globalVideo) {
        setGlobalVideo(null);
        return;
      }
      
      // Layer 2: Top level Modals
      
      if (state.isAdPlaying) return;
      if (state.unlockingMovie) {
        setUnlockingMovie(null);
        return;
      }
      if (state.showPremiumModal) {
        setShowPremiumModal(false);
        return;
      }
      if (state.showAuthModal) {
        setShowAuthModal(false);
        return;
      }
      if (state.showSpinnerPage) {
        setShowSpinnerPage(false);
        return;
      }
      if (state.reportingData) {
        setReportingData(null);
        return;
      }
      if (state.isRequestOpen) {
        setIsRequestOpen(false);
        return;
      }
      if (state.isChatOpen) {
        setIsChatOpen(false);
        return;
      }
      
      // Layer 3: Movie Details
      if (state.selectedMovie) {
        setSelectedMovie(null);
        return;
      }
      
      // Layer 4: Category View
      if (state.selectedCategory) {
        setSelectedCategory(null);
        return;
      }
      
      // Layer 5: Search
      if (state.isSearchActive) {
        setIsSearchActive(false);
        return;
      }
      
      // Layer 6: Tabs -> return to home
      if (state.activeTab !== 'home') {
        setActiveTab('home');
        return;
      }
      
      // Layer 7: Exit App logic (double tap)
      const now = Date.now();
      if (now - lastBackPress < 2000) {
        CapApp.exitApp();
      } else {
        lastBackPress = now;
        setToastMessage("Press back again to exit");
      }
    };
    
    CapApp.addListener('backButton', handleBackButton);
    
    // Also handle web browser back button
    const handleWebBack = (e: PopStateEvent) => {
      handleBackButton();
      // Push state back so we can trap it again
      window.history.pushState(null, '', window.location.href);
    };
    
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleWebBack);
    
    return () => {
      CapApp.removeAllListeners();
      window.removeEventListener('popstate', handleWebBack);
    };
  }, []);
  // ------------------------------------


  if (appError) {
    throw appError;
  }

  useEffect(() => {
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
        setGlobalVideo({ url, movie: nextMovie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, nextMovie) });
      } else {
        setGlobalVideo(null);
      }
      return;
    }
    const timer = setTimeout(() => {
      setNextVideoCountdown(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [nextVideoCountdown]);

  useEffect(() => {
    try {
      const savedCW = localStorage.getItem('SANFLIX_CW');
      if (savedCW) setContinueWatchingIds(JSON.parse(savedCW));
      
      const savedML = localStorage.getItem('SANFLIX_MYLIST');
      if (savedML) setMyListIds(JSON.parse(savedML));
      
      const savedSH = localStorage.getItem('SANFLIX_SEARCH_HISTORY');
      if (savedSH) setSearchHistory(JSON.parse(savedSH));
    } catch(e) {}
  }, []);

  // Auto-check for App Updates (Blogger & Static version.json config)
  useEffect(() => {
    const fetchVersionMetadata = async () => {
      let versionData: any = null;
      
      // 1. First, try to fetch from the local static config file /version.json
      try {
        const res = await fetch('/version.json');
        if (res.ok) {
          versionData = await res.json();
        }
      } catch (e) {
        console.warn('Failed to fetch local version.json, trying Blogger...', e);
      }

      // 2. Try fetching from the Blogger URL / Feed API as a fallback or live check
      if (!versionData) {
        try {
          const feedUrl = 'https://sanflixpremuim.blogspot.com/feeds/posts/default?alt=json';
          const feedRes = await fetch(feedUrl);
          if (feedRes.ok) {
            const feedJson = await feedRes.json();
            const entries = feedJson.feed?.entry || [];
            for (const entry of entries) {
              const title = entry.title?.$t || undefined;
              const content = entry.content?.$t || undefined;
              const versionMatch = title.match(/v\\d+\\.\\d+\\.\\d+/i) || content.match(/v\\d+\\.\\d+\\.\\d+/i);
              if (versionMatch) {
                versionData = {
                  appName: "SANFLIX PRO",
                  versionCode: versionMatch[0],
                  description: "New update released on official Blogger!",
                  iconUrl: "",
                  packageName: "com.sanflix.pro"
                };
                break;
              }
            }
          }
        } catch (e) {
          console.warn('Failed to parse Blogger feed:', e);
        }
      }

      // 3. Fallback to default newer version metadata if both fail
      if (!versionData) {
        versionData = {
          appName: "SANFLIX PRO",
          versionCode: "2.0.1",
          description: "Premium High-Speed servers unlocked! Better stability, faster loading speeds, and multi-language player fixed.",
          iconUrl: "",
          packageName: "com.sanflix.pro"
        };
      }

      // Compare versions
      const CURRENT_VERSION = "1.0.0"; // Current installed app version
      if (versionData && versionData.versionCode && versionData.versionCode !== CURRENT_VERSION) {
        const skippedVersion = localStorage.getItem('SANFLIX_SKIPPED_VERSION');
        if (skippedVersion !== versionData.versionCode) {
          // Display a notification inside the app header's notification drawer
          if ((window as any).addNewNotification) {
            (window as any).addNewNotification(`New Update Available (Version ${versionData.versionCode})! Go to Profile to install.`);
          }
          
          // Trigger the beautiful liveUpdate card popup inside ProfileHub component
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('sanflix-app-update', { detail: versionData }));
          }, 3000);
        }
      }
    };

    const delayTimer = setTimeout(() => {
      fetchVersionMetadata();
    }, 3000);

    return () => clearTimeout(delayTimer);
  }, []);

const handleSelectMovie = (movie: any, ignoreLock: boolean = false) => {
    if (!user) {
      setPendingMovie(movie);
      setShowAuthModal(true);
      return;
    }
    // Coin lock moved to PlayerModal so users can view details before unlocking
    setSelectedMovie(movie);
    
    const movieId = movie.id || movie.firebase_id;
    if (continueWatchingIds.includes(movieId)) {
      showToast('Continuing where you left off');
    }

    // Add to continue watching
    const newCW = [movieId, ...continueWatchingIds.filter(id => id !== movieId)].slice(0, 15);
    setContinueWatchingIds(newCW);
    localStorage.setItem('SANFLIX_CW', JSON.stringify(newCW));
  };

  const toggleMyList = async (e: React.MouseEvent, movie: any) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const id = movie.id || movie.firebase_id;
    let newML;
    if (myListIds.includes(id)) {
      newML = myListIds.filter(item => item !== id);
    } else {
      newML = [id, ...myListIds];
    }
    setMyListIds(newML);
    localStorage.setItem('SANFLIX_MYLIST', JSON.stringify(newML));
    
    // Sync to Firestore if not guest
    if (user && !user.isGuest) {
       try {
         await updateDoc(doc(db, 'users', user.uid), { myListIds: newML });
       } catch (err: any) {
         if (err.code === 'not-found') {
             try {
                
                await setDoc(doc(db, 'users', user.uid), { myListIds: newML }, { merge: true });
             } catch (e) {
                console.error("Failed to create user doc for myList", e);
             }
         } else {
             console.error("Failed to sync myList to Firestore", err);
         }
       }
    }
  };

  const handleSearchCommit = (query: string) => {
    if (!query.trim()) return;
    const newSH = [query.trim(), ...searchHistory.filter(q => safeLower(q) !== safeLower(query.trim()))].slice(0, 8);
    setSearchHistory(newSH);
    localStorage.setItem('SANFLIX_SEARCH_HISTORY', JSON.stringify(newSH));
    setIsSearchFocused(false);
  };

  const moviesListRef = useRef<any[]>(moviesList);
  useEffect(() => {
    moviesListRef.current = moviesList;
  }, [moviesList]);

  useEffect(() => {
    if (!db) return;
    const qTrending = doc(db, 'SanFlix_Content', 'TRENDING_SEARCHES');
    const unsubscribeTrending = onSnapshot(qTrending, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const queries = data.queries || [];
        setTrendingSearches(queries.map((q: string, i: number) => ({ id: `trending-${i}`, query: q })));
      }
    }, (err) => {
      console.error('Error fetching trending searches:', err);
    });
    return () => unsubscribeTrending();
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightMode]);

  useEffect(() => {
    // Refresh content is now handled by onSnapshot directly.
    const handleOpenMovieEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const movieId = customEvent.detail?.id;
      if (movieId) {
         const found = moviesListRef.current.find(m => (m.id || m.firebase_id) === movieId);
         if (found) {
             handleSelectMovie(found);
         }
      }
    };
    window.addEventListener('sanflix-open-movie', handleOpenMovieEvent);
    return () => {
      window.removeEventListener('sanflix-open-movie', handleOpenMovieEvent);
    };
  }, []);

  const initialFetchRef = useRef(true);

  useEffect(() => {
    if (!db) {
      setMoviesList(staticMovies);
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, 'SanFlix_Content'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0));
      list = list.filter((item: any) => !item.is_deleted);
      if (list.length > 0) {
        setMoviesList(list);
      } else {
        setMoviesList(staticMovies);
      }
      setIsLoading(false);

      if (!initialFetchRef.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if ((window as any).addNewNotification) {
              (window as any).addNewNotification(`New release: ${data.title}`, change.doc.id);
            }
          }
        });
      } else {
        initialFetchRef.current = false;
      }
    }, (err) => {
      console.error(err);
      setAppError(new Error("Failed to load content from the database. Please check your connection and try again."));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter content based on adult content setting
  const filteredContent = useMemo(() => {
    let list = moviesList;

    if (!isPHubEnabled) {
      list = list.filter(m => !m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub'));
    }

    if (!isAdultEnabled) {
      list = list.filter(m => {
        const isPhub = m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub');
        if (isPhub && isPHubEnabled) return true;
        return !m.ad_gate;
      });
    }

    list = list.filter(m => m.id !== 'TRENDING_SEARCHES');
    
    // Normalize categories to combine similar ones
    return list.map(m => {
      let cats = m.mapped_category_rail ? String(m.mapped_category_rail).split(',').map(c => c.trim()) : [];
      cats = cats.map(c => {
        const lower = c.toLowerCase();
        if (lower === 'romance' || lower === 'love story') return 'Romantic';
        if (lower === 'horror zone') return 'Horror';
        if (lower === 'animation') return 'Anime';
        return c;
      });
      
      // Auto add "Old is gold" if release year is <= 2010
      if (m.release_date) {
        const match = String(m.release_date).match(/\\b(19\\d{2}|20\\d{2})\\b/);
        if (match) {
           const year = parseInt(match[1], 10);
           if (year <= 2010) {
              cats.push('Old is gold');
           }
        }
      }
      
      // Auto add "Global Movies" if it's a movie and not Indian regional
      const lowerCats = cats.map(c => c.toLowerCase());
      const isIndianRegional = lowerCats.some(c => c === 'bollywood' || c === 'south indian' || c === 'tollywood' || c === 'bhojpuri' || c === 'indian tv serials' || c === 'serial' || c === 'indian tv');
      const isMovie = m.media_layout_format && m.media_layout_format.toLowerCase().includes('movie');
      if (isMovie && !isIndianRegional) {
         cats.push('Global Movies');
      }
      
      cats = Array.from(new Set(cats.filter(Boolean)));
      return { ...m, mapped_category_rail: cats.join(', ') };
    });

    if (selectedLanguage && selectedLanguage !== 'All Languages') {
       const lang = selectedLanguage.toLowerCase();
       list = list.filter(m => {
         const inLang = safeLower(m.language).includes(lang);
         const inUrls = Array.isArray(m.language_urls) && m.language_urls.some((l) => safeLower(l.language).includes(lang));
         const inCat = safeLower(m.mapped_category_rail).includes(lang);
         return inLang || inUrls || inCat;
       });
    }

    return list;
  }, [isAdultEnabled, isPHubEnabled, moviesList, selectedLanguage]);

  const urlHandledRef = React.useRef(false);
  React.useEffect(() => {
    if (filteredContent.length > 0 && !urlHandledRef.current) {
      urlHandledRef.current = true;
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (id) {
        const movieToOpen = filteredContent.find(m => m.id === id || m.firebase_id === id);
        if (movieToOpen) {
          handleSelectMovie(movieToOpen);
        }
      }
    }
  }, [filteredContent]);

  const highlightedMovies = React.useMemo(() => {
    const list = filteredContent.filter(m => m.is_highlighted);
    if (list.length > 0) return list;
    return [...filteredContent]
      .filter(m => safeLower(m.media_layout_format).includes('movie'))
      .sort((a, b) => (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')))
      .slice(0, 5);
  }, [filteredContent]);

  const recentlyAdded = React.useMemo(() => [...filteredContent].slice(0, 15), [filteredContent]);
  const forYouMovies = React.useMemo(() => {
    return filteredContent.filter(m => m.is_highlighted || (parseFloat(m.rating as string) >= 8.0)).sort(() => Math.random() - 0.5).slice(0, 15);
  }, [filteredContent]);

  const trailerContent = React.useMemo(() => filteredContent.filter(m => String(m.trailer_id || undefined).trim() !== ''), [filteredContent]);
  const upcomingMovies = React.useMemo(() => {
    return filteredContent.filter(m => {
       return m.mapped_category_rail && String(m.mapped_category_rail).toLowerCase().includes('upcoming');
    }).sort((a, b) => {
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateA - dateB;
    });
  }, [filteredContent]);

  const sanFlixProContent = React.useMemo(() => {
    return filteredContent.filter(m => m.is_sanflix_pro);
  }, [filteredContent]);

  const phubLiveContent = React.useMemo(() => {
    return filteredContent.filter(m => m.is_phub_live);
  }, [filteredContent]);

  const phubContent = React.useMemo(() => {
    return filteredContent.filter(m => !m.is_phub_live && m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub'));
  }, [filteredContent]);

  const standardContent = React.useMemo(() => {
    return filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
  }, [filteredContent]);

  const oldIsGoldMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('old is gold')), [standardContent]);
  const actionMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('action')), [standardContent]);
  const horrorMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('horror')), [standardContent]);
  const crimeMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('crime')), [standardContent]);
  const romanticMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('romant') || safeLower(m.mapped_category_rail).includes('romance')), [standardContent]);
  const comedyMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('comed')), [standardContent]);
  const dramaMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('drama')), [standardContent]);
  const adventureMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('adventure')), [standardContent]);
  const bhojpuriMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('bhojpuri')), [standardContent]);
  const sadContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sad')), [standardContent]);
  const wweContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('wwe')), [standardContent]);
  const warContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('war')), [standardContent]);
  const tvShowsHub = React.useMemo(() => standardContent.filter(m => safeLower(m.media_layout_format).includes('show') || safeLower(m.mapped_category_rail).includes('show')), [standardContent]);
  const serialsNetwork = React.useMemo(() => standardContent.filter(m => safeLower(m.media_layout_format).includes('series') || safeLower(m.mapped_category_rail).includes('serial')), [standardContent]);
  const indianTvSerials = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('serial') || safeLower(m.mapped_category_rail).includes('indian tv')), [standardContent]);
  const animeContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('anime') || safeLower(m.mapped_category_rail).includes('animation')), [standardContent]);
  const sciFiMovies = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sci-fi') || safeLower(m.mapped_category_rail).includes('scifi')), [standardContent]);
  const animationShows = React.useMemo(() => standardContent.filter(m => (safeLower(m.mapped_category_rail).includes('anime') || safeLower(m.mapped_category_rail).includes('animation')) && (safeLower(m.media_layout_format).includes('show') || safeLower(m.media_layout_format).includes('series'))), [standardContent]);
  const netflixContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('netflix')), [standardContent]);
  const primeContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('prime')), [standardContent]);
  const altBalajiContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('altbalaji')), [standardContent]);
  const sonyLivContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('sonyliv')), [standardContent]);
  const mxPlayerContent = React.useMemo(() => standardContent.filter(m => safeLower(m.mapped_category_rail).includes('mx player')), [standardContent]);

  const sortByRating = (arr: any[]) => arr.sort((a, b) => (parseFloat(b.rating || '0') - parseFloat(a.rating || '0')));
  const popularMovies = React.useMemo(() => sortByRating(standardContent.filter(m => safeLower(m.media_layout_format).includes('movie'))).slice(0, 20), [standardContent]);
  const topGlobalMovies = React.useMemo(() => sortByRating(standardContent.filter(m => safeLower(m.media_layout_format).includes('movie'))).slice(0, 10), [standardContent]);

  const networks = [
    { id: 'netflix', name: 'NETFLIX', label: 'NETFLIX', colorClass: 'from-red-600 to-red-900 border-red-500/50', initial: 'N', textClass: 'text-white' },
    { id: 'prime', name: 'PRIME VIDEO', label: 'PRIME VIDEO', colorClass: 'from-blue-600 to-cyan-900 border-blue-500/50', initial: 'P', textClass: 'text-white' },
    { id: 'altbalaji', name: 'ALTBALAJI', label: 'ALTBALAJI', colorClass: 'from-orange-600 to-red-900 border-orange-500/50', initial: 'A', textClass: 'text-white' },
    { id: 'sonyliv', name: 'SONYLIV', label: 'SONYLIV', colorClass: 'from-yellow-500 to-yellow-800 border-yellow-500/50', initial: 'S', textClass: 'text-black' },
    { id: 'mxplayer', name: 'MX PLAYER', label: 'MX PLAYER', colorClass: 'from-blue-800 to-blue-950 border-blue-800/50', initial: 'M', textClass: 'text-white' }
  ];

  const currentSpotlight = highlightedMovies[currentSlideIndex] || null;
  const continueWatchingMovies = React.useMemo(() => continueWatchingIds.map(id => filteredContent.find(m => m.id === id || m.firebase_id === id)).filter(Boolean), [continueWatchingIds, filteredContent]);
  const myListMovies = React.useMemo(() => myListIds.map(id => filteredContent.find(m => m.id === id || m.firebase_id === id)).filter(Boolean), [myListIds, filteredContent]);
  const recommendedForYou = React.useMemo(() => filteredContent.filter(m => m.is_highlighted || (parseFloat(m.rating || '0') >= 8.0)).sort(() => Math.random() - 0.5).slice(0, 15), [filteredContent]);
  const comingSoonMovies = React.useMemo(() => filteredContent.filter(m => m.mapped_category_rail && String(m.mapped_category_rail).toLowerCase().includes('upcoming')).sort((a,b) => (new Date(a.release_date||0).getTime() - new Date(b.release_date||0).getTime())), [filteredContent]);

  const topAction = React.useMemo(() => sortByRating(actionMovies).slice(0, 10), [actionMovies]);
  const topHorror = React.useMemo(() => sortByRating(horrorMovies).slice(0, 10), [horrorMovies]);
  const topCrime = React.useMemo(() => sortByRating(crimeMovies).slice(0, 10), [crimeMovies]);
  const topRomantic = React.useMemo(() => sortByRating(romanticMovies).slice(0, 10), [romanticMovies]);
  const topComedy = React.useMemo(() => sortByRating(comedyMovies).slice(0, 10), [comedyMovies]);
  const topSerials = React.useMemo(() => sortByRating(indianTvSerials).slice(0, 10), [indianTvSerials]);
  const topShows = React.useMemo(() => sortByRating(tvShowsHub).slice(0, 10), [tvShowsHub]);

  const continueWatchingList = React.useMemo(() => {
    return continueWatchingIds
      .map(id => filteredContent.find(m => m.id === id || m.firebase_id === id))
      .filter(Boolean);
  }, [continueWatchingIds, filteredContent]);

  const myListContent = React.useMemo(() => {
    return myListIds
      .map(id => filteredContent.find(m => m.id === id || m.firebase_id === id))
      .filter(Boolean);
  }, [myListIds, filteredContent]);

  const categoriesList = React.useMemo(() => {
    const cats = new Set<string>();
    filteredContent.forEach(m => {
       if (m.mapped_category_rail) {
         String(m.mapped_category_rail).split(',').forEach(c => cats.add(c.trim()));
       }
    });
    const dynamicCats = Array.from(cats).filter(c => c && !defaultStaticCategories.includes(c));
    return [...defaultStaticCategories, ...dynamicCats, 'Actress: Sunny Leone', 'Actress: Mia Khalifa', 'Actress: Dani Daniels', 'Actress: Kendra Lust', 'Actress: Angela White'];
  }, [filteredContent, isAdultEnabled, isPHubEnabled]);

  const searchResults = React.useMemo(() => {
    let result = filteredContent;
    
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(
        (m) => safeLower(m.title).includes(queryStr) || safeLower(m.mapped_category_rail).includes(queryStr) || safeLower(m.cast_crew).includes(queryStr)
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
       if (selectedCategory === 'Premium') {
          result = result.filter(m => m.is_sanflix_pro);
       } else if (selectedCategory === 'Recent') {
          result = result.sort((a,b) => (new Date(b.release_date||0).getTime() - new Date(a.release_date||0).getTime()));
       } else if (selectedCategory.startsWith('Actress: ')) {
          const actressName = safeLower(selectedCategory.replace('Actress: ', '').trim());
          result = result.filter(m => safeLower(m.cast_crew).includes(actressName) || safeLower(m.title).includes(actressName));
       } else {
          const catKeyword = safeLower(selectedCategory).replace(' vip', '');
          result = result.filter(m => 
            safeLower(m.mapped_category_rail) === safeLower(selectedCategory) ||
            safeLower(m.mapped_category_rail).includes(catKeyword) ||
            safeLower(m.title).includes(catKeyword) ||
            safeLower(m.synopsis).includes(catKeyword) ||
            safeLower(m.cast_crew).includes(catKeyword)
          );
       }
    }
    
    return result;
  }, [searchQuery, filteredContent, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-zinc-950 min-h-screen relative shadow-2xl shadow-black border-x border-zinc-900/50 flex flex-col pb-24 overflow-hidden">
          {/* Skeleton Header */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-900/50">
            <div className="w-8 h-8 rounded bg-zinc-800 animate-pulse"></div>
            <div className="w-24 h-6 rounded bg-zinc-800 animate-pulse"></div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse"></div>
          </div>
          
          {/* Skeleton Hero Spotlight */}
          <div className="px-4 mb-6 mt-4">
             <div className="w-full aspect-[4/3] rounded-[24px] bg-zinc-800/80 animate-pulse border border-zinc-800/50 flex flex-col justify-end p-5">
               <div className="w-20 h-3 bg-zinc-700 rounded mb-2"></div>
               <div className="w-3/4 h-6 bg-zinc-700 rounded mb-4"></div>
               <div className="w-32 h-8 bg-zinc-700 rounded-xl"></div>
             </div>
             <div className="flex justify-center gap-1.5 mt-3">
               <div className="w-4 h-1.5 rounded-full bg-zinc-800 animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 animate-pulse"></div>
             </div>
          </div>

          {/* Skeleton Categories */}
          <div className="flex px-4 gap-3 mb-6 overflow-hidden">
             <div className="w-20 h-8 rounded-full bg-zinc-800 animate-pulse shrink-0"></div>
             <div className="w-24 h-8 rounded-full bg-zinc-800 animate-pulse shrink-0"></div>
             <div className="w-16 h-8 rounded-full bg-zinc-800 animate-pulse shrink-0"></div>
             <div className="w-20 h-8 rounded-full bg-zinc-800 animate-pulse shrink-0"></div>
          </div>

          {/* Skeleton Rail 1 */}
          <div className="px-0 mb-6">
             <div className="w-32 h-4 bg-zinc-800 animate-pulse ml-4 rounded mb-3"></div>
             <div className="flex gap-4 px-4 overflow-hidden">
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-3/4 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-1/2 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-2/3 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
             </div>
          </div>

          {/* Skeleton Rail 2 */}
          <div className="px-0 mb-6">
             <div className="w-40 h-4 bg-zinc-800 animate-pulse ml-4 rounded mb-3"></div>
             <div className="flex gap-4 px-4 overflow-hidden">
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-3/4 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-1/2 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="h-48 rounded-xl bg-zinc-800 animate-pulse mb-2"></div>
                  <div className="w-2/3 h-3 rounded bg-zinc-800 animate-pulse"></div>
                </div>
             </div>
          </div>

          {/* Bottom Nav Skeleton */}
          <div className="absolute bottom-0 inset-x-0 h-[72px] bg-zinc-950 border-t border-zinc-900/80 flex justify-around items-center px-4">
             <div className="w-12 h-12 rounded-full bg-zinc-900 animate-pulse flex flex-col items-center justify-center gap-1"><div className="w-5 h-5 rounded bg-zinc-800"></div><div className="w-8 h-1 rounded bg-zinc-800"></div></div>
             <div className="w-12 h-12 rounded-full bg-zinc-900 animate-pulse flex flex-col items-center justify-center gap-1"><div className="w-5 h-5 rounded bg-zinc-800"></div><div className="w-8 h-1 rounded bg-zinc-800"></div></div>
             <div className="w-12 h-12 rounded-full bg-zinc-900 animate-pulse flex flex-col items-center justify-center gap-1"><div className="w-5 h-5 rounded bg-zinc-800"></div><div className="w-8 h-1 rounded bg-zinc-800"></div></div>
             <div className="w-12 h-12 rounded-full bg-zinc-900 animate-pulse flex flex-col items-center justify-center gap-1"><div className="w-5 h-5 rounded bg-zinc-800"></div><div className="w-8 h-1 rounded bg-zinc-800"></div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30">
            {batterySaver && (
        <div className="fixed inset-0 bg-black/40 pointer-events-none z-[9999]" style={{ mixBlendMode: 'multiply' }} />
      )}
      <AnimatePresence>
        {showPromo && promoProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div 
              className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.3)] max-w-sm w-full cursor-pointer relative group"
              onClick={() => {
                 window.open(promoProduct.affiliateUrl, '_blank', 'noopener,noreferrer');
                 setShowPromo(false);
              }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPromo(false); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-zinc-300 hover:text-white z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative aspect-square">
                <BlurImage src={promoProduct.imageUrl || 'https://via.placeholder.com/400'} alt={promoProduct.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">Special Offer</div>
              </div>
              <div className="p-4 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">{promoProduct.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-400">Sponsored</span>
                  <span className="text-sm font-bold text-red-500 flex items-center gap-1">Shop Now <ExternalLink className="w-3 h-3" /></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-md mx-auto bg-zinc-950 min-h-screen relative shadow-2xl shadow-black border-x border-zinc-900/50 overflow-hidden pb-24">
        {activeTab === 'home' ? (
          <>
            <TopHeader
              coins={coins}
              onCoinClick={() => setShowSpinnerPage(true)}
              onSearch={setSearchQuery}
              isSearchActive={isSearchActive}
              setIsSearchActive={setIsSearchActive}
              searchQuery={searchQuery}
              isLightMode={isLightMode}
              setIsLightMode={setIsLightMode}
              onSearchFocus={setIsSearchFocused}
              onSearchSubmit={handleSearchCommit}
              onCartClick={() => setActiveTab('cart')}
              onGamesClick={() => setActiveTab('games')}
              hasContinueWatching={continueWatchingIds.length > 0}
              onResumeLatest={() => {
                if (continueWatchingIds.length > 0) {
                  const movieId = continueWatchingIds[0];
                  const latestMovie = filteredContent.find(m => m.firebase_id === movieId) || moviesList.find(m => m.firebase_id === movieId);
                  if (latestMovie) {
                    const saved = localStorage.getItem('SANFLIX_PROGRESS');
                    let initialTime = 0;
                    let lastUrl = null;
                    if (saved) {
                      const progressData = JSON.parse(saved);
                      if (progressData[movieId]) {
                        initialTime = progressData[movieId].currentTime || 0;
                        lastUrl = progressData[movieId].url;
                      }
                    }
                    const fallbackUrl = lastUrl || latestMovie.streaming_link_1 || (latestMovie.episodes && latestMovie.episodes.length > 0 ? latestMovie.episodes[0].url : null);
                    if (fallbackUrl) {
                      if (!user) {
                        setPendingMovie(latestMovie);
                        setShowAuthModal(true);
                        return;
                      }
                      if (!isUnlocked(movieId)) {
                          setUnlockingMovie(latestMovie);
                          return;
                      }
                      setGlobalVideo({ 
                        url: fallbackUrl, 
                        movie: latestMovie, 
                        showLanguageSelector: false, 
                        showQualitySelector: false, 
                        showEpisodeSelector: false, 
                        fallbackUrls: getFallbacks(fallbackUrl, latestMovie), 
                        initialTime 
                      });
                    } else {
                      handleSelectMovie(latestMovie);
                    }
                  }
                }
              }}
            />

            <AnimatePresence mode="sync">
              {isSearchActive && searchQuery.trim() !== '' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="px-4 py-6"
                >
                  <h2 className="text-lg font-semibold mb-4 border-l-4 border-red-600 pl-2">
                    Search Results ({searchResults.length})
                  </h2>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <p>No movies found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {searchResults.map((movie, idx) => (
                        <motion.div
                          layoutId={`search-${movie.id || movie.firebase_id}-${idx}`}
                          key={`${movie.id || movie.firebase_id}-${idx}`}
                          className="group cursor-pointer"
                          onClick={() => handleSelectMovie(movie)}
                        >
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                            <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                              <div className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                {movie.rating || 'N/A'}
                              </div>
                              {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                                <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                                  {movie.eps_count > 0 ? `${movie.eps_count} EPs` : (movie.episodes ? `${movie.episodes.length} EP${movie.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                                </div>
                              )}
                            </div>
                            {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                              className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${myListIds.includes(movie.id || movie.firebase_id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          </div>
                          <h3 className="text-sm font-medium leading-tight line-clamp-1">{movie.title}</h3>
                          <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-8 pb-8 pt-2"
                >
                  {/* Search History Cloud */}
                  {isSearchActive && isSearchFocused && searchHistory.length > 0 && searchQuery.trim() === '' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="px-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <History className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Recent Searches</span>
                         </div>
                         <button onClick={() => { setSearchHistory([]); localStorage.setItem('SANFLIX_SEARCH_HISTORY', JSON.stringify([])); }} className="text-xs text-red-500 hover:text-red-400 transition-colors">Clear</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((query, idx) => (
                           <div key={idx} className="flex items-center rounded-full bg-zinc-800/80 border border-zinc-700 overflow-hidden group">
                             <button
                               onClick={() => setSearchQuery(query)}
                               className="px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                             >
                               {query}
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const newHistory = searchHistory.filter((_, i) => i !== idx);
                                 setSearchHistory(newHistory);
                                 localStorage.setItem('SANFLIX_SEARCH_HISTORY', JSON.stringify(newHistory));
                               }}
                               className="px-2 py-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-700 transition-colors"
                               title="Remove from history"
                             >
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Trending Movies */}
                  {isSearchActive && isSearchFocused && popularMovies.length > 0 && searchQuery.trim() === '' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="px-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2 text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Trending Now</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {popularMovies.slice(0, 6).map((movie, idx) => (
                           <div
                              key={`${movie.id || movie.firebase_id}-${idx}`}
                              onClick={() => {
                                 setIsSearchFocused(false);
                                 handleSelectMovie(movie);
                              }}
                              className="group cursor-pointer flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg p-2 transition-colors border border-zinc-800 hover:border-zinc-700"
                           >
                             <div className="w-12 h-16 bg-zinc-800 rounded shrink-0 overflow-hidden relative">
                               <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-zinc-200 line-clamp-2 leading-snug">{movie.title}</h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{movie.mapped_category_rail}</p>
                             </div>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Stylish Language & Category Filters */}
                  <div className="px-4 mb-4 flex flex-col gap-3">
                    {/* Language Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest shrink-0 mr-1">Language:</span>
                      {['All Languages', 'Hindi', 'English', 'Bhojpuri', 'Tamil', 'Telugu'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang === 'All Languages' ? '' : lang)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                            (selectedLanguage === lang || (!selectedLanguage && lang === 'All Languages'))
                              ? 'bg-red-600 text-white border-red-500 shadow-[0_2px_10px_rgba(220,38,38,0.3)]'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Category Chips Scroll */}
                  <div className="flex overflow-x-auto gap-3 hide-scrollbar px-4">
                    {categoriesList.map((catName) => {
                      const isActive = selectedCategory === catName;
                      const is18 = catName === '🔥 18+ Hub';
                      const isPro = catName === 'Premium';
                      
                      return (
                        <button
                          key={catName}
                          onClick={() => setSelectedCategory(isActive ? null : catName)}
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-colors ${
                            isActive 
                              ? (isPro ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-600 text-white border-red-500')
                              : isPro
                                ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                : is18 
                                  ? 'border-pink-500/30 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10'
                                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          {catName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Filtered Active View Mode */}
                  {selectedCategory ? (
                    <div className="px-4">
                      {selectedCategory.startsWith('Actress: ') ? (
                        <div className="mb-8 relative overflow-hidden rounded-2xl p-6 md:p-10 bg-gradient-to-r from-pink-900/40 via-red-900/40 to-yellow-900/40 border border-red-900/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                          <button onClick={() => setSelectedCategory(null)} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-10">
                            <ChevronLeft className="w-6 h-6 text-white" />
                          </button>
                          
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] shrink-0 bg-zinc-900 flex items-center justify-center">
                            {(() => {
                              const actressName = selectedCategory.replace('Actress: ', '');
                              const actressInfo = predefinedActresses.find(a => a.name === actressName);
                              if (actressInfo?.imageUrl) {
                                return (
                                  <BlurImage src={actressInfo.imageUrl} alt={actressName} className="w-full h-full object-cover" />
                                );
                              }
                              return (
                                <span className="text-4xl font-black text-zinc-700">{actressName.charAt(0)}</span>
                              );
                            })()}
                          </div>
                          <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                            <span className="text-red-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-1">Spotlight</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">{selectedCategory.replace('Actress: ', '')}</h2>
                            <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed">
                              Explore all exclusive movies and web series featuring {selectedCategory.replace('Actress: ', '')}. Watch her boldest and most captivating performances.
                            </p>
                            <div className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10">
                               <Sparkles className="w-4 h-4 text-pink-400" />
                               {searchResults.length} Titles Available
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-6">
                          <button onClick={() => setSelectedCategory(null)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-zinc-300" />
                          </button>
                          <h2 className="text-xl font-bold tracking-tight text-white m-0 border-l-4 border-red-600 pl-3">
                            {selectedCategory === 'All' ? 'All Content' : selectedCategory} ({searchResults.length})
                          </h2>
                        </div>
                      )}
                      {searchResults.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">
                          <p>No titles found in this category.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {searchResults.map((movie, idx) => (
                            <motion.div
                              layoutId={`cat-${movie.id || movie.firebase_id}-${idx}`}
                              key={`${movie.id || movie.firebase_id}-${idx}`}
                              className="group cursor-pointer"
                              onClick={() => handleSelectMovie(movie)}
                            >
                              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                                <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                                  <div className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1 border border-white/10">
                                    <Star className="w-3 h-3 fill-yellow-400" />
                                    {movie.rating || 'N/A'}
                                  </div>
                                  {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                                    <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                                      {movie.eps_count > 0 ? `${movie.eps_count} EPs` : (movie.episodes ? `${movie.episodes.length} EP${movie.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                                    </div>
                                  )}
                                </div>
                                {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                                  className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors"
                                >
                                  <Heart className={`w-4 h-4 ${myListIds.includes(movie.id || movie.firebase_id) ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                              </div>
                              <h3 className="text-sm font-medium leading-tight line-clamp-1">{movie.title}</h3>
                              <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Spotlight Hero */}
                  {currentSpotlight && (
                    <div className="px-4">
                      <div 
                        className="relative group/slider"
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          e.currentTarget.dataset.touchStartX = touch.clientX.toString();
                          e.currentTarget.dataset.touchStartY = touch.clientY.toString();
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
                          >
                            <BlurImage src={currentSpotlight.backdrop_url || currentSpotlight.imageUrl} alt={currentSpotlight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none" />
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
                        </button>
                      </div>
                      <div className="flex justify-center gap-1.5 mt-3">
                        {highlightedMovies.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-4 bg-red-600' : 'w-1.5 bg-zinc-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {continueWatchingMovies.length > 0 && (
                    <MovieRail 
                      title="Continue Watching" 
                      emoji="▶️" 
                      movies={continueWatchingMovies} 
                      onSelectMovie={handleSelectMovie} 
                      colorClass="border-red-600" 
                      onToggleMyList={toggleMyList}
                      myListIds={myListIds} continueWatchingIds={continueWatchingIds}
                    />
                  )}


                  {/* Live TV Trending Rail */}
                  <LiveTvRail onSelectChannel={(channel) => { 
                    localStorage.setItem('pendingLiveChannel', JSON.stringify(channel)); 
                    setActiveTab('trending'); 
                  }} />

                  {/* Actresses Rail */}
                  <ActressRail onSelectActress={(name) => setSelectedCategory('Actress: ' + name)} />
                  
                  {/* SanFlix-Pro Network Channel */}
                  {sanFlixProContent.length > 0 && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-red-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">SanFlix-Pro</h2>
                        <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Premium</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {sanFlixProContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-lg shadow-black/50 border-2 border-red-500/20 group-hover:border-red-500 transition-colors">
                              <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-red-500 border border-red-500/30">
                                4K ULTRA
                              </div>
                              {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full border border-white/10 text-white hover:text-red-500"
                              >
                                <Heart className={`w-3 h-3 ${myListIds.includes(movie.id || movie.firebase_id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-1 text-zinc-100">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Porn Hub Network Channel */}
                  {phubLiveContent.length > 0 && isPHubEnabled && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-orange-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porn Hub (LIVE)</h2>
                        <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Live</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {phubLiveContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] border-2 border-orange-500/30 group-hover:border-orange-500 transition-all">
                              <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 border border-orange-500/30">
                                LIVE
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110">
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-2 text-zinc-100">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {phubContent.length > 0 && isPHubEnabled && (
                    <div className="px-0 mb-6">
                      <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-orange-500 ml-4 rounded-sm h-4">
                        <Star className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" />
                        <h2 className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Porn Hub</h2>
                        <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest">Premium</span>
                      </div>
                      <div className="flex overflow-x-auto gap-4 hide-scrollbar px-4 pb-4">
                        {phubContent.map((movie, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSelectMovie(movie)}
                            className="group cursor-pointer relative shrink-0 w-36 sm:w-40"
                          >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-[0_0_15px_rgba(249,115,22,0.15)] border-2 border-orange-500/30 group-hover:border-orange-500 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                              <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-500 border border-orange-500/30">
                                PREMIUM
                              </div>
                              {movie.rating && movie.rating > 8.5 && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg flex items-center gap-0.5 z-10">
                                  <TrendingUp className="w-2.5 h-2.5" />
                                  POPULAR
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!user) {
                                      setPendingMovie(movie);
                                      setShowAuthModal(true);
                                      return;
                                    }
                                    const movieId = movie.id || movie.firebase_id;
                                    if (!isUnlocked(movieId)) {
                                      setUnlockingMovie(movie);
                                      return;
                                    }
                                    let url = movie.streaming_link_1;
                                    if (!url && movie.episodes && movie.episodes.length > 0) {
                                      url = movie.episodes[0].url;
                                    }
                                    if (url) {
                                      let initialTime = 0;
                                      const movieId = movie.id || movie.firebase_id;
                                      if (movieId) {
                                        const saved = localStorage.getItem('SANFLIX_PROGRESS');
                                        if (saved) {
                                          const progressData = JSON.parse(saved);
                                          if (progressData[movieId] && progressData[movieId].url === url) {
                                            initialTime = progressData[movieId].currentTime || 0;
                                          }
                                        }
                                      }
                                      setGlobalVideo({
                                        url,
                                        movie,
                                        showLanguageSelector: false,
                                        showQualitySelector: false,
                                        showEpisodeSelector: false,
                                        fallbackUrls: getFallbacks(url, movie),
                                        initialTime
                                      });
                                    } else {
                                      handleSelectMovie(movie);
                                    }
                                  }}
                                  className="bg-orange-500 text-black rounded-full p-3 shadow-lg shadow-orange-500/50 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110"
                                >
                                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-sm font-black leading-tight line-clamp-1 text-zinc-100">{movie.title}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Network Channels */}
                  <div className="px-0 mb-6">
                    <div className="flex items-center gap-2 px-4 mb-3 border-l-4 border-red-600 ml-4 rounded-sm h-4">
                      <Tv className="w-4 h-4 text-zinc-400" />
                      <h2 className="text-sm font-bold tracking-wide">Popular Network Channels</h2>
                    </div>
                    <div className="flex overflow-x-auto gap-3 hide-scrollbar px-4 pb-2">
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => setSelectedCategory(network.name)}
                          className={`group relative shrink-0 w-36 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg bg-gradient-to-br ${network.colorClass} border hover:brightness-110 hover:scale-105 transition-all overflow-hidden`}
                        >
                          <div className="absolute -right-2 -bottom-4 opacity-[0.15] text-[60px] font-black italic transform -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
                             {network.initial}
                          </div>
                          <span className={`${network.textClass} relative z-10 drop-shadow-md`}>
                            {network.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* REQUESTED: Sabse Upar */}
                  <MovieRail title="Old is Gold" emoji="🥇" movies={oldIsGoldMovies} onSelectMovie={handleSelectMovie} colorClass="border-yellow-600" onSeeAll={() => setSelectedCategory('Old is gold')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  {/* PHASE 1: USER ENGAGEMENT & RECENT HUBS */}
                  <MovieRail title="Recently Added" emoji="🆕" movies={recentlyAdded} onSelectMovie={handleSelectMovie} colorClass="border-blue-500" onSeeAll={() => setSelectedCategory('Action')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Recommended For You" emoji="✨" movies={recommendedForYou} onSelectMovie={handleSelectMovie} colorClass="border-purple-500" onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Popular Movies" emoji="🔥" movies={popularMovies} onSelectMovie={handleSelectMovie} colorClass="border-red-500" onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Latest Trailers" emoji="🎬" movies={trailerContent} onSelectMovie={handleSelectMovie} colorClass="border-sky-500" onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  {comingSoonMovies.length > 0 && (
                    <MovieRail title="Coming Soon" emoji="🗓️" movies={comingSoonMovies} onSelectMovie={handleSelectMovie} colorClass="border-yellow-400" isComingSoon={true} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  )}
                  
                  {/* PHASE 2: GLOBAL PLATFORM METRICS */}
                  <MovieRail title="Top 10 Global Movies" emoji="🌍" movies={topGlobalMovies} onSelectMovie={handleSelectMovie} colorClass="border-yellow-400" isTop10={true} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 Action Movies" emoji="💥" movies={topAction} onSelectMovie={handleSelectMovie} colorClass="border-orange-500" isTop10={true} onSeeAll={() => setSelectedCategory('Action')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 Horror Movies" emoji="👻" movies={topHorror} onSelectMovie={handleSelectMovie} colorClass="border-zinc-500" isTop10={true} onSeeAll={() => setSelectedCategory('Horror')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 Crime Movies" emoji="🕵️" movies={topCrime} onSelectMovie={handleSelectMovie} colorClass="border-red-800" isTop10={true} onSeeAll={() => setSelectedCategory('Crime')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 Romantic Movies" emoji="💖" movies={topRomantic} onSelectMovie={handleSelectMovie} colorClass="border-pink-500" isTop10={true} onSeeAll={() => setSelectedCategory('Romantic')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 Comedy Movies" emoji="😂" movies={topComedy} onSelectMovie={handleSelectMovie} colorClass="border-yellow-500" isTop10={true} onSeeAll={() => setSelectedCategory('Comedy')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 TV Serials" emoji="📺" movies={topSerials} onSelectMovie={handleSelectMovie} colorClass="border-indigo-400" isTop10={true} onSeeAll={() => setSelectedCategory('Serial')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Top 10 TV Shows" emoji="🍿" movies={topShows} onSelectMovie={handleSelectMovie} colorClass="border-sky-400" isTop10={true} onSeeAll={() => setSelectedCategory('Show')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  {/* PHASE 3: CORE GENRE EXPERIENCES */}
                  <MovieRail title="Action Hub" emoji="⚔️" movies={actionMovies} onSelectMovie={handleSelectMovie} colorClass="border-orange-500" onSeeAll={() => setSelectedCategory('Action')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Drama Emotions" emoji="🎭" movies={dramaMovies} onSelectMovie={handleSelectMovie} colorClass="border-fuchsia-500" onSeeAll={() => setSelectedCategory('Drama')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Crime Thrillers" emoji="🔪" movies={crimeMovies} onSelectMovie={handleSelectMovie} colorClass="border-red-800" onSeeAll={() => setSelectedCategory('Crime')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Comedy Central" emoji="😂" movies={comedyMovies} onSelectMovie={handleSelectMovie} colorClass="border-yellow-500" onSeeAll={() => setSelectedCategory('Comedy')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  
                  {/* REQUESTED: BETWEEN COMEDY AND ANIME */}
                  <MovieRail title="Bhojpuri Cinema" emoji="💃" movies={bhojpuriMovies} onSelectMovie={handleSelectMovie} colorClass="border-orange-600" onSeeAll={() => setSelectedCategory('Bhojpuri')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Horror Zone" emoji="🧟" movies={horrorMovies} onSelectMovie={handleSelectMovie} colorClass="border-zinc-500" onSeeAll={() => setSelectedCategory('Horror')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Romantic Nights" emoji="🌹" movies={romanticMovies} onSelectMovie={handleSelectMovie} colorClass="border-pink-500" onSeeAll={() => setSelectedCategory('Romantic')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Indian TV Serials" emoji="📺" movies={indianTvSerials} onSelectMovie={handleSelectMovie} colorClass="border-rose-400" onSeeAll={() => setSelectedCategory('Serial')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  
                  <MovieRail title="Anime Universe" emoji="🎌" movies={animeContent} onSelectMovie={handleSelectMovie} colorClass="border-emerald-500" onSeeAll={() => setSelectedCategory('Anime')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  <MovieRail title="Sad Content" emoji="😭" movies={sadContent} onSelectMovie={handleSelectMovie} colorClass="border-slate-500" onSeeAll={() => setSelectedCategory('Sad')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="WWE Action" emoji="🤼" movies={wweContent} onSelectMovie={handleSelectMovie} colorClass="border-orange-500" onSeeAll={() => setSelectedCategory('WWE')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="War Zone" emoji="🎖️" movies={warContent} onSelectMovie={handleSelectMovie} colorClass="border-stone-600" onSeeAll={() => setSelectedCategory('War')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  <MovieRail title="Sci-Fi Space" emoji="👽" movies={sciFiMovies} onSelectMovie={handleSelectMovie} colorClass="border-cyan-500" onSeeAll={() => setSelectedCategory('Sci-Fi')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Adventure Calling" emoji="🗺️" movies={adventureMovies} onSelectMovie={handleSelectMovie} colorClass="border-green-600" onSeeAll={() => setSelectedCategory('Adventure')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  {/* PHASE 4: NETWORK SPECIFIC HUBS */}
                  <MovieRail title="TV Shows Hub" emoji="📺" movies={tvShowsHub} onSelectMovie={handleSelectMovie} colorClass="border-indigo-500" onSeeAll={() => setSelectedCategory('Show')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Anime TV Shows" emoji="✏️" movies={animationShows} onSelectMovie={handleSelectMovie} colorClass="border-purple-400" onSeeAll={() => setSelectedCategory('Anime')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                  {/* NETWORK RAILS */}
                  <MovieRail title="Netflix Exclusives" emoji="N" movies={netflixContent} onSelectMovie={handleSelectMovie} colorClass="border-red-600" onSeeAll={() => setSelectedCategory('NETFLIX')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="Prime Video" emoji="P" movies={primeContent} onSelectMovie={handleSelectMovie} colorClass="border-sky-500" onSeeAll={() => setSelectedCategory('PRIME VIDEO')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="AltBalaji Specials" emoji="A" movies={altBalajiContent} onSelectMovie={handleSelectMovie} colorClass="border-orange-500" onSeeAll={() => setSelectedCategory('ALTBALAJI')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="SonyLIV Exclusives" emoji="S" movies={sonyLivContent} onSelectMovie={handleSelectMovie} colorClass="border-indigo-700" onSeeAll={() => setSelectedCategory('SONYLIV')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />
                  <MovieRail title="MX PLAYER Exclusives" emoji="M" movies={mxPlayerContent} onSelectMovie={handleSelectMovie} colorClass="border-blue-600" onSeeAll={() => setSelectedCategory('MX PLAYER')} onToggleMyList={toggleMyList} myListIds={myListIds} continueWatchingIds={continueWatchingIds} unlockedContent={unlockedContent} />

                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : activeTab === 'discover' ? (
          <Discover content={filteredContent} onSelectMovie={handleSelectMovie} unlockedContent={unlockedContent} />
        ) : activeTab === 'games' ? (
          <GamesHub onSelectGame={(id) => setActiveTab(id)} />
        ) : activeTab === 'explore' ? (
          <div className="pt-8 pb-32 px-4 min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-6">Explore All Movies & Shows</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredContent.map((movie, idx) => (
                   <motion.div
                     key={`${movie.id || movie.firebase_id}-${idx}`}
                     className="group cursor-pointer"
                     onClick={() => handleSelectMovie(movie)}
                   >
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50">
                       <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                     </div>
                     <h3 className="text-sm font-medium leading-tight line-clamp-1 text-white">{movie.title}</h3>
                   </motion.div>
              ))}
            </div>
          </div>
        ) : activeTab === 'shop' ? (
          <Shop />
        ) : activeTab === 'cart' ? (
          <CartScreen />
        ) : activeTab === 'mylist' ? (
          <div className="pt-8 pb-32 min-h-screen flex flex-col">
            <h2 className="text-2xl font-black text-white mb-6 px-4 tracking-tight">My List</h2>
            {myListMovies.length === 0 ? (
               <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 mx-4">
                  <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 font-medium font-sans">Your list is empty.</p>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[200px] mx-auto">Explore movies and TV shows and tap the heart icon to add them to your list.</p>
               </div>
            ) : (
               <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar pb-8">
                 {myListMovies.map((movie, idx) => (
                   <motion.div
                     layoutId={`mylist-${movie.id || movie.firebase_id}-${idx}`}
                     key={`${movie.id || movie.firebase_id}-${idx}`}
                     className="group cursor-pointer shrink-0 w-36 sm:w-48"
                     onClick={() => handleSelectMovie(movie)}
                   >
                     <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-zinc-800/50 shadow-lg">
                       <BlurImage src={movie.poster_url || movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       {unlockedContent[movie.id || movie.firebase_id] && unlockedContent[movie.id || movie.firebase_id] > Date.now() && (
                         <CountdownTimer expiryTime={unlockedContent[movie.id || movie.firebase_id]} />
                       )}
                       <button 
                         onClick={(e) => toggleMyList(e, movie)}
                         className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white hover:text-red-500 transition-colors z-10"
                       >
                         <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                       </button>
                       <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                         {((movie.episodes && movie.episodes.length > 0 && movie.episodes[0].url) || movie.eps_count > 0) && (
                           <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                             {movie.eps_count > 0 ? `${movie.eps_count} EPs` : (movie.episodes ? `${movie.episodes.length} EP${movie.episodes.length > 1 ? 's' : ''}` : 'EPs')}
                           </div>
                         )}
                       </div>
                     </div>
                     <h3 className="text-sm font-medium text-white leading-tight line-clamp-1">{movie.title}</h3>
                     <p className="text-[10px] text-zinc-400 mt-1">{movie.mapped_category_rail}</p>
                   </motion.div>
                 ))}
               </div>
            )}
          </div>
        ) : activeTab === 'profile' ? (
          <ProfileHub
            user={user}
            onLogout={() => {
              auth.signOut();
              localStorage.removeItem('sanflix_user');
              localStorage.removeItem('sanflix_guest_id');
              setUser(null);
            }}
            onLoginClick={() => setShowAuthModal(true)}
            isAdultEnabled={isAdultEnabled}
            setIsAdultEnabled={setIsAdultEnabled}
            isAdminUnlocked={isAdminUnlocked}
            setIsAdminUnlocked={setIsAdminUnlocked}
            onChangeTab={setActiveTab}
            batterySaver={batterySaver}
            setBatterySaver={setBatterySaver}
          />
        ) : activeTab === 'trending' ? (
          <LiveTvScreen 
            user={user}
            onRequirePremium={(expired) => {
               setPremiumTrialMode(expired);
               setShowPremiumModal(true);
            }} 
          />
        ) : activeTab === 'admin' && isAdminUnlocked ? (
          <AdminPanel />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            Section under construction
          </div>
        )}
        
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      {/* SanFlix-Pro Chat Bot FAB */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-rose-500 shadow-lg shadow-red-900/50 flex items-center justify-center text-white border-2 border-red-400/50 relative overflow-hidden"
        >
          <Bot className="w-7 h-7" />
          <Sparkles className="w-3 h-3 text-yellow-300 absolute top-3 right-3 animate-pulse" />
        </motion.button>
      </div>
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} availableMovies={moviesList} onSelectMovie={handleSelectMovie} onOpenShop={() => setActiveTab('shop')} />

      

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full shadow-2xl flex items-center gap-2"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMovie && (
          <PlayerModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
            allContent={filteredContent}
            onSelectMovie={handleSelectMovie}
            
            isUnlocked={isUnlocked(selectedMovie.id || selectedMovie.firebase_id)}
            onRequireUnlock={() => setUnlockingMovie(selectedMovie)}
            onPlayVideo={(url, movie) => {
              const movieId = movie?.id || movie?.firebase_id;
              let initialTime = 0;
              if (movieId) {
                const saved = localStorage.getItem('SANFLIX_PROGRESS');
                if (saved) {
                  const progressData = JSON.parse(saved);
                  if (progressData[movieId] && progressData[movieId].url === url) {
                    initialTime = progressData[movieId].currentTime;
                  }
                }
              }
              setGlobalVideo({ url, movie, showLanguageSelector: false, showQualitySelector: false, showEpisodeSelector: false, fallbackUrls: getFallbacks(url, movie), initialTime });
            }}
          />
        )}
      </AnimatePresence>

      
      {/* App Update Popup */}
      <AnimatePresence>
        {appUpdateData && (
          <div className="fixed inset-0 z-[10000] bg-black/90 flex flex-col items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Update Available!</h2>
              <p className="text-zinc-400 font-medium mb-2">Version {appUpdateData.version} is here</p>
              
              <div className="bg-zinc-950 rounded-xl p-4 mb-6 text-left border border-zinc-800 h-32 overflow-y-auto">
                <h4 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wider">What's New:</h4>
                <p className="text-zinc-300 text-sm whitespace-pre-line">{appUpdateData.changelog}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = appUpdateData.url}
                  className="relative z-10 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  Update Now
                </button>
                <button 
                  onClick={() => setAppUpdateData(null)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Video Player Overlay (Persists for PiP) */}
      <AnimatePresence>
        {globalVideo && (
            <>
              <DirectVideoPlayer
            isPremium={user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true'}
            onRequirePremium={() => {
               setGlobalVideo(null);
               setShowPremiumModal(true);
            }}
            url={globalVideo.url}
                title={globalVideo.movie?.title || 'Unknown'}
                initialTime={globalVideo.initialTime}
                onClose={() => {
                  setGlobalVideo(null);
                  setNextVideoCountdown(null);
                }}
                onShowQualitySelector={() => setGlobalVideo({ ...globalVideo, showQualitySelector: true })}
                onShowLanguageSelector={() => setGlobalVideo({ ...globalVideo, showLanguageSelector: true })}
                onShowEpisodeSelector={() => setGlobalVideo({ ...globalVideo, showEpisodeSelector: true })}
                hasLanguages={!!(globalVideo.movie?.is_direct_streaming && globalVideo.movie.language_urls?.length > 1)}
                hasQualities={!!(globalVideo.movie?.download_link_480p || globalVideo.movie?.download_link_720p || globalVideo.movie?.download_link_1080p || globalVideo.movie?.download_link_hdr)}
                hasEpisodes={!!(globalVideo.movie?.episodes && globalVideo.movie.episodes.length > 1)}
                onProgressUpdate={(currentTime, duration) => {
                  const movieId = globalVideo.movie?.id || globalVideo.movie?.firebase_id;
                  if (movieId) {
                    const saved = localStorage.getItem('SANFLIX_PROGRESS');
                    const progressData = saved ? JSON.parse(saved) : {};
                    progressData[movieId] = { currentTime, duration, url: globalVideo.url };
                    localStorage.setItem('SANFLIX_PROGRESS', JSON.stringify(progressData));
                    window.dispatchEvent(new CustomEvent('sanflix_progress_update', { detail: { movieId, currentTime, duration } }));
                  }
                }}
                fallbackUrls={globalVideo.fallbackUrls}
                onReport={() => {
                   let epTitle = '';
                   let epIdx = -1;
                   if (globalVideo.movie?.episodes) {
                     const idx = globalVideo.movie.episodes.findIndex((e: any) => e.url === globalVideo.url || e.url_2 === globalVideo.url || e.url_3 === globalVideo.url || e.url_4 === globalVideo.url);
                     if (idx !== -1) {
                        epTitle = globalVideo.movie.episodes[idx].title;
                        epIdx = idx;
                     }
                   }
                   reportBrokenLink(globalVideo.movie?.id || globalVideo.movie?.firebase_id, globalVideo.movie?.title, globalVideo.url, epTitle, epIdx === -1 ? undefined : epIdx);
                }}
                onEnded={() => {
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
                }}
              />
              
              {/* Next Episode Countdown Modal */}
              <AnimatePresence>
                {nextVideoCountdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed right-8 bottom-32 z-[250] bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 w-80 text-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-emerald-400">Up Next</h4>
                      <button onClick={() => setNextVideoCountdown(null)} className="p-1 hover:bg-white/10 rounded-full transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                        <img src={nextVideoCountdown.movie.thumbnail_url || nextVideoCountdown.movie.poster_url} alt="Next" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-2 leading-tight">{nextVideoCountdown.movie.title}</p>
                        <p className="text-zinc-400 text-xs mt-1">Starting in {nextVideoCountdown.timeLeft}s</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button 
                        onClick={() => setNextVideoCountdown(prev => prev ? { ...prev, timeLeft: 0 } : null)}
                        className="flex-1 bg-white text-black py-2 rounded-xl font-bold hover:bg-zinc-200 transition text-sm"
                      >
                        Play Now
                      </button>
                      <button 
                        onClick={() => {
                          setNextVideoCountdown(null);
                          setGlobalVideo(null);
                        }}
                        className="flex-1 bg-white/10 text-white py-2 rounded-xl font-bold hover:bg-white/20 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Simulated Language Selector Bottom Sheet */}
              <AnimatePresence>
                {globalVideo.showLanguageSelector && (
                  <div className="fixed inset-0 z-[250] flex flex-col justify-end pointer-events-auto">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setGlobalVideo({ ...globalVideo, showLanguageSelector: false })} />
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="relative bg-[#0C0C0E] w-full max-w-md mx-auto rounded-t-3xl p-6 shadow-2xl border-t border-zinc-800"
                    >
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" /> Select Audio Language
                      </h3>
                      <div className="space-y-3">
                        {globalVideo.movie.language_urls?.map((langObj: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: langObj.url, showLanguageSelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === langObj.url ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold">{langObj.language}</span>
                            {globalVideo.url === langObj.url && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Episode Selector Bottom Sheet */}
              <AnimatePresence>
                {globalVideo.showEpisodeSelector && globalVideo.movie?.episodes && (
                  <div className="fixed inset-0 z-[250] flex flex-col justify-end pointer-events-auto">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setGlobalVideo({ ...globalVideo, showEpisodeSelector: false })} />
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="relative bg-[#0C0C0E] w-full max-w-md mx-auto rounded-t-3xl p-6 shadow-2xl border-t border-zinc-800 max-h-[70vh] flex flex-col"
                    >
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />
                      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2 shrink-0">
                        <Play className="w-5 h-5 text-green-500" /> Select Episode
                      </h3>
                      <div className="space-y-3 overflow-y-auto hide-scrollbar">
                        {globalVideo.movie.episodes.filter((e: any) => e.url).map((ep: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: ep.url, showEpisodeSelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === ep.url ? 'bg-green-600/20 border border-green-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold flex items-center gap-2 line-clamp-1 text-left">{ep.title}</span>
                            {globalVideo.url === ep.url && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Simulated Quality Selector Bottom Sheet */}
              <AnimatePresence>
                {globalVideo.showQualitySelector && (
                  <div className="fixed inset-0 z-[250] flex flex-col justify-end pointer-events-auto">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setGlobalVideo({ ...globalVideo, showQualitySelector: false })} />
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="relative bg-[#0C0C0E] w-full max-w-md mx-auto rounded-t-3xl p-6 shadow-2xl border-t border-zinc-800"
                    >
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-emerald-500" /> Select Video Quality
                      </h3>
                      <div className="space-y-3">
                        {globalVideo.movie.download_link_480p && (
                          <button
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: globalVideo.movie.download_link_480p, showQualitySelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === globalVideo.movie.download_link_480p ? 'bg-emerald-600/20 border border-emerald-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold flex items-center gap-2">480p <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">SD</span></span>
                            {globalVideo.url === globalVideo.movie.download_link_480p && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </button>
                        )}
                        {globalVideo.movie.download_link_720p && (
                          <button
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: globalVideo.movie.download_link_720p, showQualitySelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === globalVideo.movie.download_link_720p ? 'bg-emerald-600/20 border border-emerald-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold flex items-center gap-2">720p <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">HD</span></span>
                            {globalVideo.url === globalVideo.movie.download_link_720p && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </button>
                        )}
                        {globalVideo.movie.download_link_1080p && (
                          <button
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: globalVideo.movie.download_link_1080p, showQualitySelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === globalVideo.movie.download_link_1080p ? 'bg-emerald-600/20 border border-emerald-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold flex items-center gap-2">1080p <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">FHD</span></span>
                            {globalVideo.url === globalVideo.movie.download_link_1080p && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </button>
                        )}
                        {globalVideo.movie.download_link_hdr && (
                          <button
                            onClick={() => {
                              setGlobalVideo({ ...globalVideo, url: globalVideo.movie.download_link_hdr, showQualitySelector: false });
                            }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${globalVideo.url === globalVideo.movie.download_link_hdr ? 'bg-emerald-600/20 border border-emerald-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
                          >
                            <span className="text-white font-semibold flex items-center gap-2">4K / HDR <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded-full">ULTRA</span></span>
                            {globalVideo.url === globalVideo.movie.download_link_hdr && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </>
        )}
      </AnimatePresence>
      <NoticeModal />\n
      <AppOpenAd />
      {/* Fraud Warning Modal */}
      <AnimatePresence>
        {fraudWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-md bg-gradient-to-b from-black to-red-950 border-2 border-red-600 rounded-3xl p-8 shadow-[0_0_80px_rgba(220,38,38,0.4)] text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none"></div>
              
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                 <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                Admin Warning!
              </h2>
              
              <p className="text-red-200 text-lg mb-8 font-medium whitespace-pre-wrap">
                {fraudWarning.message}
              </p>
              
              {fraudWarning.count < 3 && (
                <button 
                  onClick={() => setFraudWarning(null)}
                  className="relative z-10 w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-colors uppercase tracking-widest"
                >
                  I Understand
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <AnimatePresence>
        
        {showPremiumModal && (
          <SubscriptionModal 
            trialMode={premiumTrialMode}
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={(plan) => {
              const premiumUser = { ...user, isPremium: true };
              setUser(premiumUser);
              localStorage.setItem('sanflix_user', JSON.stringify(premiumUser));
              setShowPremiumModal(false);
              localStorage.setItem('SANFLIX_PREMIUM', 'true');
            }}
            onWatchAdTrial={async () => {
               setShowPremiumModal(false);
               if (Capacitor.isNativePlatform()) {
                 try {
                   // Using UnityAds since Spinner works
                   await UnityAds.loadRewardedVideo({ placementId: "Rewarded_Android" });
                   const result = await UnityAds.showRewardedVideo();
                   if (result && result.success) {
                     const newExpiry = Date.now() + (10 * 60 * 1000);
                     localStorage.setItem('SANFLIX_LIVE_TRIAL_EXPIRY', newExpiry.toString());
                   } else {
                     alert("Failed to play ad. Please try again later.");
                   }
                 } catch(e) {
                   console.error("Native Ad Error", e);
                   try {
                     // Fallback to AdMob Rewarded
                     await AdMob.prepareRewardVideoAd({ adId: AD_CONFIG.admob.rewarded });
                     await AdMob.showRewardVideoAd();
                     // We would listen for reward in real app, but for simplicity assuming success here if it shows
                     const newExpiry = Date.now() + (10 * 60 * 1000);
                     localStorage.setItem('SANFLIX_LIVE_TRIAL_EXPIRY', newExpiry.toString());
                   } catch(err) {
                     alert("Failed to load native ads. Please try again.");
                   }
                 }
               } else {
                 setIsAdPlaying(true);
               }
            }}
            onFraudWarning={(msg) => {
               const warnings = parseInt(localStorage.getItem('SANFLIX_WARNINGS') || '0') + 1;
               localStorage.setItem('SANFLIX_WARNINGS', warnings.toString());
               
               if (warnings >= 3) {
                  // Permanent Ban
                  setFraudWarning({ message: "3rd WARNING: You have been permanently banned for attempting to cheat the Admin.", count: 3 });
                  auth.signOut();
                  auth.currentUser?.delete().catch(e => console.log("Failed to delete from Auth", e));
                  localStorage.removeItem('sanflix_user');
                  localStorage.setItem('SANFLIX_BANNED', 'true');
                  setUser(null);
                  setTimeout(() => {
                     window.location.reload();
                  }, 5000);
               } else {
                  setFraudWarning({ message: msg + `\n\nWarning ${warnings}/3`, count: warnings });
               }
            }}
          />
        )}
        {isAdPlaying && (
          <AdPlayer 
            onAdComplete={() => {
               setIsAdPlaying(false);
               const newExpiry = Date.now() + (10 * 60 * 1000); // 10 minutes
               localStorage.setItem('SANFLIX_LIVE_TRIAL_EXPIRY', newExpiry.toString());
            }}
          />
        )}
        {showAuthModal && (
          <AuthModal 
            onClose={() => {
              setShowAuthModal(false);
              setPendingMovie(null);
            }} 
            onSuccess={(newUser) => {
              setUser(newUser);
              setShowAuthModal(false);
              if (pendingMovie) {
                setTimeout(() => {
                  setSelectedMovie(pendingMovie);
                  
                  const movieId = pendingMovie.id || pendingMovie.firebase_id;
                  let cwIds = [];
                  try { cwIds = JSON.parse(localStorage.getItem('SANFLIX_CW') || '[]'); } catch(e){}
                  const newCW = [movieId, ...cwIds.filter(id => id !== movieId)].slice(0, 15);
                  localStorage.setItem('SANFLIX_CW', JSON.stringify(newCW));
                }, 100);
                setPendingMovie(null);
              }
            }} 
          />
        )}
        
        {unlockingMovie && (
          <UnlockModal 
            movie={unlockingMovie} 
            coins={coins}
            onClose={() => setUnlockingMovie(null)}
            onUnlock={async () => {
              const movieId = unlockingMovie.id || unlockingMovie.firebase_id;
              await unlockMovie(movieId);
              handleSelectMovie(unlockingMovie, true);
            }}
            onGoToSpinner={() => {
              setUnlockingMovie(null);
              setShowSpinnerPage(true);
            }}
          />
        )}

        {showSpinnerPage && (
          <SpinnerPage 
            currentCoins={coins}
            onClose={() => setShowSpinnerPage(false)}
            onReward={addCoins}
          />
        )}
      </AnimatePresence>
      <ReportModal
        isOpen={!!reportingData?.isOpen}
        onClose={() => setReportingData(null)}
        title={reportingData?.episodeTitle ? `Report Episode: ${reportingData.episodeTitle}` : 'Report Video Issue'}
        onSubmit={async (description) => {
          if (!reportingData) return;
          const payload = {
            movieId: reportingData.movieId || undefined,
            movieTitle: reportingData.movieTitle || undefined,
            episodeTitle: reportingData.episodeTitle || undefined,
            episodeIdx: reportingData.episodeIdx !== undefined ? reportingData.episodeIdx : null,
            failedUrl: reportingData.failedUrl || undefined,
            description: description || undefined,
            timestamp: new Date().toISOString(),
            resolved: false
          };
          // Remove any accidental undefined
          Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
          await addDoc(collection(db, 'SanFlix_Reports'), payload);
        }}
      />
    </div>
  );
}