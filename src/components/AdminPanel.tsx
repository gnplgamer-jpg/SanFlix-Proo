import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Loader2, AlertCircle, Edit, Trash2, X, Save, Lock, ShoppingBag } from 'lucide-react';
import { db, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from '../firebase';

const standardCategories = ["Bollywood", "Hollywood", "South Indian", "Tollywood", "Bhojpuri", "Global Movies", "Romantic", "Horror", "Action", "Thriller", "Sci-Fi", "Crime", "Comedy", "Anime", "Old is gold", "NETFLIX", "PRIME VIDEO", "ALTBALAJI", "SONYLIV", "MX PLAYER", "Indian TV Serials", "Sad", "WWE", "War"];
const adultCategories = ["ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films", "Porn Hub"];

const initialForm = {
  tmdb_id: '',
  title: '',
  synopsis: '',
  cast_crew: '',
  poster_url: '',
  backdrop_url: '',
  rating: '',
  media_layout_format: 'Movie Category',
  mapped_category_rail: 'Bollywood',
  release_date: '',
  season_count: 0,
  eps_count: 0,
  streaming_link_1: '',
  streaming_link_2: '',
  streaming_link_3: '',
  streaming_link_4: '',
  stream_type: 'Auto-Detect',
  episodes: [{ title: 'Episode 1', url: '', url_2: '', url_3: '', url_4: '', download_url: '' }],
  trailer_id: '',
  download_link_480p: '',
  download_link_720p: '',
  download_link_1080p: '',
  download_link_hdr: '',
  is_highlighted: false,
  ad_gate: false,
  is_sanflix_pro: false,
  is_direct_streaming: false,
  is_phub_live: false,
  language_urls: [{ language: 'Hindi', url: '' }]
};

export function AdminPanel() {
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(initialForm);
  const [contentList, setContentList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingCustomCat, setIsAddingCustomCat] = useState(false);
  const [adminTab, setAdminTab] = useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash' | 'requests'>('content');
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [trendingTMDB, setTrendingTMDB] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [wizardQueue, setWizardQueue] = useState<any[]>([]);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [flashPopupItem, setFlashPopupItem] = useState<any>(null);
  const [flashCountdown, setFlashCountdown] = useState(5);
  const [flashDismissed, setFlashDismissed] = useState(false);

  useEffect(() => {
     if (trendingTMDB.length === 0) {
        setTrendingLoading(true);
        fetch('/api/meta-data/trending-tmdb')
          .then(res => res.json())
          .then(data => {
             if (data.results) {
               setTrendingTMDB(data.results);
             }
             setTrendingLoading(false);
          })
          .catch(() => setTrendingLoading(false));
     }
  }, []);

  useEffect(() => {
    if (trendingTMDB.length > 0 && contentList.length > 0 && !flashDismissed && !isWizardMode) {
      const pending = trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id)));
      if (pending.length > 0 && !flashPopupItem) {
        setWizardQueue(pending);
        setFlashPopupItem(pending[0]);
        setFlashCountdown(5);
      }
    }
  }, [trendingTMDB, contentList, flashDismissed, isWizardMode, flashPopupItem]);

  useEffect(() => {
    let timer: any;
    if (flashPopupItem && flashCountdown > 0) {
      timer = setTimeout(() => setFlashCountdown(prev => prev - 1), 1000);
    } else if (flashCountdown === 0 && flashPopupItem) {
      setFlashPopupItem(null);
      setFlashDismissed(true);
    }
    return () => clearTimeout(timer);
  }, [flashPopupItem, flashCountdown]);

  const startWizard = () => {
    setFlashPopupItem(null);
    setFlashDismissed(true);
    setIsWizardMode(true);
    setAdminTab('content');
    window.scrollTo(0, 0);
    setTimeout(() => scourCatalogTMDbApi(wizardQueue[0].id.toString()), 100);
  };

  const skipWizardItem = () => {
    if (wizardQueue.length > 1) {
      const nextQueue = wizardQueue.slice(1);
      setWizardQueue(nextQueue);
      setFormData(initialForm);
      window.scrollTo(0, 0);
      setTimeout(() => scourCatalogTMDbApi(nextQueue[0].id.toString()), 100);
    } else {
      setIsWizardMode(false);
      setWizardQueue([]);
      setFormData(initialForm);
    }
  };


  const [shopForm, setShopForm] = useState({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5', description: '' });
  const [reports, setReports] = useState<any[]>([]);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [editingShopId, setEditingShopId] = useState<string | null>(null);
  
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [isCheckingLinks, setIsCheckingLinks] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });

  const runLinkHealthCheck = async () => {
    if (isCheckingLinks) return;
    setIsCheckingLinks(true);
    
    // Filter out items that have no streams
    const itemsToCheck = contentList.filter(item => item.streaming_link_1 || (item.episodes && item.episodes.length > 0 && item.episodes[0].url));
    setCheckProgress({ current: 0, total: itemsToCheck.length });
    
    for (let i = 0; i < itemsToCheck.length; i++) {
       const item = itemsToCheck[i];
       const link = item.streaming_link_1 || item.episodes[0].url;
       try {
          const res = await fetch(`/api/admin/check-link?url=${encodeURIComponent(link)}`);
          const data = await res.json();
          
          const isBroken = !data.ok;
          if (isBroken && !item.needs_update) {
             await updateDoc(doc(db, 'SanFlix_Content', item.firebase_id), { needs_update: true });
          } else if (!isBroken && item.needs_update) {
             await updateDoc(doc(db, 'SanFlix_Content', item.firebase_id), { needs_update: false });
          }
       } catch(e) {}
       
       setCheckProgress({ current: i + 1, total: itemsToCheck.length });
       
       // Sleep 1s to prevent spamming
       await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsCheckingLinks(false);
  };

  const [contentTab, setContentTab] = useState<'Normal' | '18+'>('Normal');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (!db) return;
    
    let unsubsReports = () => {};
    try {
      const rq = query(collection(db, 'SanFlix_Reports'));
      unsubsReports = onSnapshot(rq, (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } catch(e) {}
    
    let unsubsShop = () => {};
    try {
      const sq = query(collection(db, 'products'));
      unsubsShop = onSnapshot(sq, (snapshot) => {
        setShopProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } catch(e) {}

    const q = query(collection(db, 'SanFlix_Content'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() })).sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0));
      setContentList(list);
    }, (error) => {
      console.error("Error fetching content:", error);
    });

    return () => { unsubscribe(); unsubsReports(); unsubsShop(); };
  }, []);

  useEffect(() => {
    if (contentList && contentList.length > 0) {
      const distinct = new Set<string>();
      contentList.forEach(item => {
        if (item.mapped_category_rail) {
          const cats = String(item.mapped_category_rail).split(',').map(c => c.trim()).filter(Boolean);
          cats.forEach(c => {
            if (!standardCategories.includes(c) && !adultCategories.includes(c)) {
              distinct.add(c);
            }
          });
        }
      });
      setCustomCategories(Array.from(distinct));
    }
  }, [contentList]);



  const scourCatalogTMDbApi = async (directQuery?: string) => {
    const activeQuery = directQuery || tmdbQuery || formData.tmdb_id;
    if (!activeQuery || !activeQuery.trim()) {
      setError("Please enter a TMDB ID or search term.");
      return;
    }
    
    setTmdbLoading(true);
    setError(null);
    try {
      let rawQuery = activeQuery.trim();
      let forceMediaType = null;
      let targetSeason = null;
      
      // Parse URLs if provided
      const imdbUrlMatch = rawQuery.match(/imdb\.com\/title\/(tt\d+)/i);
      if (imdbUrlMatch) {
        const seasonMatch = rawQuery.match(/[?&]season=(\d+)/i);
        rawQuery = imdbUrlMatch[1];
        if (seasonMatch) {
          targetSeason = parseInt(seasonMatch[1]);
          forceMediaType = 'tv';
        }
      } else {
        const tmdbUrlMatch = rawQuery.match(/themoviedb\.org\/(movie|tv)\/(\d+)(?:\/season\/(\d+))?/i);
        if (tmdbUrlMatch) {
          forceMediaType = tmdbUrlMatch[1];
          rawQuery = tmdbUrlMatch[2];
          if (tmdbUrlMatch[3]) {
            targetSeason = parseInt(tmdbUrlMatch[3]);
          }
        }
      }

      const queryValue = rawQuery;
      const isNumeric = /^\d+$/.test(queryValue);
      const isImdb = /^tt\d+$/.test(queryValue.toLowerCase());
      
      let movieId = queryValue;
      let mediaType = forceMediaType || 'movie'; // Default to movie

      if (isImdb) {
        // Search by IMDb ID
        const findRes = await fetch(`/api/meta-data/find/${queryValue.trim().toLowerCase()}`);
        const findData = await findRes.json();
        
        if (findRes.ok && ((findData.movie_results && findData.movie_results.length > 0) || (findData.tv_results && findData.tv_results.length > 0))) {
          const result = (findData.movie_results && findData.movie_results.length > 0) ? findData.movie_results[0] : findData.tv_results[0];
          movieId = result.id.toString();
          mediaType = result.media_type || (findData.movie_results && findData.movie_results.length > 0 ? 'movie' : 'tv');
        } else {
          throw new Error('No matching content found for this IMDb ID');
        }
      } else if (!isNumeric) {
        // Search by title
        let searchUrl = `/api/meta-data/search?query=${encodeURIComponent(queryValue)}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        if (searchRes.ok && searchData.results && searchData.results.length > 0) {
          // Find first appropriate result (movie or tv)
          const validResult = searchData.results.find((r:any) => r.media_type === 'movie' || r.media_type === 'tv') || searchData.results[0];
          movieId = validResult.id.toString();
          if (validResult.media_type) {
            mediaType = validResult.media_type;
          }
        } else {
          throw new Error(searchData.error || 'No matching movies found');
        }
      }

      // Fetch specific details (with trailer & genres)
      let detailsRes = await fetch(`/api/meta-data/details/${movieId}?type=${mediaType}`);
      
      // Auto-fallback: try the other media type if it throws a 404 (often happens if an ID is pasted directly)
      if (!detailsRes.ok) {
        const altType = mediaType === 'movie' ? 'tv' : 'movie';
        detailsRes = await fetch(`/api/meta-data/details/${movieId}?type=${altType}`);
      }

      if (!detailsRes.ok) throw new Error("Failed to fetch movie/tv details from TMDB. Please check ID.");
      const movie = await detailsRes.json();

      let trailerKey = '';
      if (movie.videos && movie.videos.results) {
         const trailer = movie.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
         if (trailer) trailerKey = trailer.key;
      }

      let episodesList = formData.episodes;
      let seasonCount = formData.season_count;
      let epsCount = formData.eps_count;
      
      // If a specific season was requested from URL, fetch its episodes
      if (mediaType === 'tv' && targetSeason !== null) {
        try {
          const seasonRes = await fetch(`/api/meta-data/season/${movieId}/${targetSeason}`);
          if (seasonRes.ok) {
            const seasonData = await seasonRes.json();
            if (seasonData.episodes && seasonData.episodes.length > 0) {
              episodesList = seasonData.episodes.map((ep: any) => ({
                title: `S${targetSeason} E${ep.episode_number} - ${ep.name}`,
                url: '',
                download_url: ''
              }));
              seasonCount = targetSeason;
              epsCount = seasonData.episodes.length;
            }
          }
        } catch(e) {
          console.error("Failed to fetch season episodes:", e);
        }
      } else if (mediaType === 'tv' && movie.number_of_seasons) {
        seasonCount = movie.number_of_seasons;
        epsCount = movie.number_of_episodes || 0;
      }
      
      let primaryGenre = formData.mapped_category_rail;
      // If primaryGenre is not set, or is default, attempt to map from TMDB
      if (movie.genres && movie.genres.length > 0) {
         if (!formData.ad_gate) {
           const allGenres = movie.genres.map((g: any) => {
             if (g.name === 'Science Fiction') return 'Sci-Fi';
             if (g.name === 'Romance') return 'Romantic';
             return g.name;
           }).join(', ');
           
           // If user set Bhojpuri, Tollywood, or South Indian before fetch, prefer to keep it
           const isRegional = primaryGenre === 'Bhojpuri' || primaryGenre === 'Tollywood' || primaryGenre === 'South Indian';
           
           if (!isRegional) {
             primaryGenre = allGenres;
           } else {
             primaryGenre = primaryGenre + ', ' + allGenres;
           }
         }
      }

      let castCrewText = formData.cast_crew;
      if (movie.credits && movie.credits.cast) {
         castCrewText = movie.credits.cast.slice(0, 7).map((c: any) => c.name).join(', ');
      }

      setFormData(prev => ({
        ...prev,
        tmdb_id: movie.id.toString(),
        title: movie.title || movie.name || '',
        synopsis: movie.overview || '',
        cast_crew: castCrewText,
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        backdrop_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '',
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : '',
        release_date: movie.release_date || movie.first_air_date || '',
        trailer_id: trailerKey || prev.trailer_id,
        mapped_category_rail: primaryGenre,
        ad_gate: prev.ad_gate,
        episodes: episodesList || prev.episodes,
        season_count: seasonCount || prev.season_count,
        eps_count: epsCount || prev.eps_count
      }));
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    }
    setTmdbLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const newData = { ...prev, [name]: checked };
        // Handle dual mode toggle logic
        if (name === 'ad_gate') {
          newData.mapped_category_rail = checked ? "ULLU" : "Bollywood";
        }
        return newData;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is mandatory!");
      return;
    }

    setSubmitLoading(true);
    try {
      if (!db) throw new Error("Firebase not initialized");
      
      if (editingId) {
        // Update
        const docRef = doc(db, 'SanFlix_Content', editingId);
        await updateDoc(docRef, formData);
        setEditingId(null);
      } else {
        // Create
        const collectionRef = collection(db, 'SanFlix_Content');
        await addDoc(collectionRef, { ...formData, created_at: Date.now() });
      }
      
      setFormData(initialForm);
      setTmdbQuery('');
      // fetchContent removed
      setError(null);
      
      if (isWizardMode) {
        if (wizardQueue.length > 1) {
          const nextQueue = wizardQueue.slice(1);
          setWizardQueue(nextQueue);
          window.scrollTo(0, 0);
          setTimeout(() => scourCatalogTMDbApi(nextQueue[0].id.toString()), 100);
        } else {
          setIsWizardMode(false);
          setWizardQueue([]);
        }
      }
    } catch (err: any) {
      setError("Failed to save: " + err.message);
    }
    setSubmitLoading(false);
  };

  const editItem = (item: any) => {
    setEditingId(item.firebase_id);
    setFormData({
      tmdb_id: item.tmdb_id || '',
      title: item.title || '',
      synopsis: item.synopsis || '',
      cast_crew: item.cast_crew || '',
      poster_url: item.poster_url || '',
      backdrop_url: item.backdrop_url || '',
      rating: item.rating || '',
      media_layout_format: item.media_layout_format || 'Movie Category',
      mapped_category_rail: item.mapped_category_rail || 'Bollywood',
      release_date: item.release_date || '',
      season_count: item.season_count || 0,
      eps_count: item.eps_count || 0,
      streaming_link_1: item.streaming_link_1 || '',
      streaming_link_2: item.streaming_link_2 || '',
      streaming_link_3: item.streaming_link_3 || '',
      streaming_link_4: item.streaming_link_4 || '',
      stream_type: item.stream_type || 'Auto-Detect',
      episodes: item.episodes && item.episodes.length > 0 ? item.episodes : [{ title: 'Episode 1', url: item.streaming_link_1 || '', url_2: '', url_3: '', url_4: '', download_url: '' }],
      trailer_id: item.trailer_id || '',
      download_link_480p: item.download_link_480p || item.download_link || '',
      download_link_720p: item.download_link_720p || '',
      download_link_1080p: item.download_link_1080p || '',
      download_link_hdr: item.download_link_hdr || '',
      is_highlighted: item.is_highlighted || false,
      ad_gate: item.ad_gate || false,
      is_sanflix_pro: item.is_sanflix_pro || false,
      is_direct_streaming: item.is_direct_streaming || false,
      is_phub_live: item.is_phub_live || false,
      language_urls: item.language_urls && item.language_urls.length > 0 ? item.language_urls : [{ language: 'Hindi', url: '' }]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveReport = async (id: string) => {
    try {
       await deleteDoc(doc(db, 'SanFlix_Reports', id));
    } catch(e) {}
  };

  const deleteItem = async (id: string, title: string) => {
    if (!id) {
      setError("Error: Missing item ID");
      return;
    }
    try {
      // SOFT DELETE
      setContentList(prev => prev.map(item => item.firebase_id === id ? { ...item, is_deleted: true } : item));
      await updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: true, deleted_at: new Date().toISOString() });
    } catch (err: any) {
      setError("Failed to soft delete: " + err.message);
    }
  };

  const hardDeleteItem = async (id: string) => {
    try {
      setContentList(prev => prev.filter(item => item.firebase_id !== id));
      await deleteDoc(doc(db, 'SanFlix_Content', id));
    } catch (err: any) {
      setError("Failed to hard delete: " + err.message);
    }
  };

  const restoreItem = async (id: string) => {
    try {
      setContentList(prev => prev.map(item => item.firebase_id === id ? { ...item, is_deleted: false } : item));
      await updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: false });
    } catch (err: any) {
      setError("Failed to restore: " + err.message);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === filteredContent.length && filteredContent.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.firebase_id));
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const idsToDelete = [...selectedItems];
      setContentList(prev => prev.map(item => idsToDelete.includes(item.firebase_id) ? { ...item, is_deleted: true } : item));
      setSelectedItems([]);
      
      await Promise.all(idsToDelete.map(id => updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: true, deleted_at: new Date().toISOString() })));
    } catch (err: any) {
      setError("Failed to soft delete some items: " + err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const filteredContent = contentList.filter(item => {
    if (item.id === 'TRENDING_SEARCHES') return false;
    if (item.is_deleted) return false;
    const matchesTab = contentTab === '18+' ? !!item.ad_gate : !item.ad_gate;
    const matchesSearch = (item.title || '').toLowerCase().includes(contentSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  
  const trashContent = contentList.filter(item => item.is_deleted);

  const currentCategories = formData.ad_gate ? adultCategories : [...standardCategories, ...customCategories];

  return (
    <div className="px-4 py-8 bg-zinc-950 min-h-screen text-white">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">SanFlix Admin</h2>
          <div className="flex gap-4 mt-2">
            <button onClick={() => setAdminTab('content')} className={`text-sm font-bold pb-1 border-b-2 ${adminTab === 'content' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Content Injector</button>
            <button onClick={() => setAdminTab('tmdb')} className={`text-sm font-bold pb-1 border-b-2 ${adminTab === 'tmdb' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Pending / TMDB</button>
            <button onClick={() => setAdminTab('reports')} className={`text-sm font-bold pb-1 border-b-2 flex items-center gap-2 ${adminTab === 'reports' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>
               Reports {reports.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{reports.length}</span>}
            </button>
            <button onClick={() => setAdminTab('shop')} className={`text-sm font-bold pb-1 border-b-2 ${adminTab === 'shop' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Shop Products</button>
            <button onClick={() => setAdminTab('trash')} className={`text-sm font-bold pb-1 border-b-2 flex items-center gap-2 ${adminTab === 'trash' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>
               Trash {trashContent.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{trashContent.length}</span>}
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            const currentUrl = window.location.href.split('?')[0]; 
            window.open(`${currentUrl}?adminMode=true`, '_blank', 'width=1000,height=800');
          }}
          className="bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-2 rounded-lg font-medium border border-zinc-700"
        >
          Open Standalone Admin
        </button>
      </div>


      {adminTab === 'tmdb' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">Latest / Trending TMDB</h2>
             <button onClick={() => {
                setTrendingLoading(true);
                fetch('/api/meta-data/trending-tmdb')
                  .then(res => res.json())
                  .then(data => { if(data.results) setTrendingTMDB(data.results); setTrendingLoading(false); })
                  .catch(() => setTrendingLoading(false));
             }} className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Refresh</button>
          </div>
          {trendingLoading ? (
             <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).map(item => (
                   <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                     <div className="relative aspect-[2/3] bg-zinc-800">
                        <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ''} alt={item.title || item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                           <span className="text-sm font-bold">{item.title || item.name}</span>
                           <span className="text-xs text-zinc-400">{item.media_type} | {item.release_date || item.first_air_date}</span>
                           <button onClick={() => {
                              setFormData({ ...initialForm, tmdb_id: item.id.toString(), title: item.title || item.name || '', release_date: item.release_date || item.first_air_date || '' });
                              setTmdbQuery(item.id.toString());
                              setAdminTab('content');
                              window.scrollTo(0, 0);
                              setTimeout(() => {
                                 scourCatalogTMDbApi(item.id.toString());
                              }, 100);
                           }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg w-full mt-2">
                             Add as Upcoming / Release
                           </button>
                        </div>
                     </div>
                   </div>
                ))}
             </div>
          )}
        </div>
      ) : adminTab === 'trash' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Recycle Bin ({trashContent.length})
            </h2>
          </div>
          {trashContent.length === 0 ? (
            <div className="text-center text-zinc-500 py-10">Trash is empty</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trashContent.map(item => (
                <div key={item.firebase_id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                  <div className="relative aspect-[2/3] bg-zinc-800">
                    <img src={item.poster_url || item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-50 grayscale" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => restoreItem(item.firebase_id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg w-3/4">Restore</button>
                      <button onClick={() => { if(window.confirm('Permanently delete this?')) hardDeleteItem(item.firebase_id); }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg w-3/4">Delete Forever</button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">Deleted: {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : adminTab === 'shop' ? (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <ShoppingBag className="w-5 h-5 text-red-500" /> {editingShopId ? 'Edit Affiliate Product' : 'Add Affiliate Product'}
              </h3>
              {editingShopId && (
                <button 
                  onClick={() => {
                    setEditingShopId(null);
                    setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5', description: '' });
                  }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!shopForm.title || !shopForm.affiliateUrl) { alert("Title and Affiliate URL required!"); return; }
              setSubmitLoading(true);
              try {
                if (editingShopId) {
                  await updateDoc(doc(db, 'products', editingShopId), shopForm);
                  alert("Product Updated Successfully!");
                  setEditingShopId(null);
                } else {
                  await addDoc(collection(db, 'products'), shopForm);
                  alert("Product Added Successfully!");
                }
                setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5', description: '' });
              } catch (err: any) {
                setError(err.message);
              } finally {
                setSubmitLoading(false);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Product Title *</label>
                  <input type="text" value={shopForm.title} onChange={e => setShopForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL</label>
                    <input type="text" value={shopForm.imageUrl} onChange={e => setShopForm(prev => ({ ...prev, imageUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                  </div>
                  {shopForm.imageUrl && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-zinc-400 mb-2">Image Preview</label>
                      <div className="w-32 h-32 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950 flex items-center justify-center">
                        <img src={shopForm.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image'; }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                  <select value={shopForm.category || 'General'} onChange={e => setShopForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white">
                    <option value="General">General</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="18+">18+</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Daraz Affiliate URL *</label>
                  <input type="url" value={shopForm.affiliateUrl} onChange={e => setShopForm(prev => ({ ...prev, affiliateUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Price</label>
                  <input type="text" placeholder="e.g. Rs. 499" value={shopForm.price || ''} onChange={e => setShopForm(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={shopForm.rating || '5'} onChange={e => setShopForm(prev => ({ ...prev, rating: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                  <textarea rows={3} value={shopForm.description || ''} onChange={e => setShopForm(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" placeholder="Product description..."></textarea>
                </div>
              </div>
              
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <button type="submit" disabled={submitLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center">
                {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingShopId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-white">Manage Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {shopProducts.map((prod) => (
                  <div key={prod.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex flex-col">
                    <div className="h-32 bg-black rounded-md overflow-hidden mb-3 relative flex items-center justify-center p-2">
                       {prod.imageUrl ? (
                         <img src={prod.imageUrl} alt={prod.title} className="max-w-full max-h-full object-contain" />
                       ) : (
                         <span className="text-zinc-600 text-xs">No Image</span>
                       )}
                       <div className="absolute top-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-zinc-300">
                         {prod.category || 'General'}
                       </div>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-3 flex-1">{prod.title}</h4>
                    <div className="flex items-center gap-2 mt-auto">
                      <button 
                        onClick={() => {
                          setEditingShopId(prod.id);
                          setShopForm({
                            title: prod.title || '',
                            imageUrl: prod.imageUrl || '',
                            affiliateUrl: prod.affiliateUrl || '',
                            category: prod.category || 'General',
                            price: prod.price || '',
                            rating: prod.rating || '5',
                            description: prod.description || ''
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1.5 rounded flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={async () => {
                          // Direct delete as confirm() may be blocked in iframe
                          await deleteDoc(doc(db, 'products', prod.id));
                        }}
                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-500 text-xs font-medium py-1.5 rounded flex items-center justify-center gap-1 border border-red-900/50"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
               ))}
               {shopProducts.length === 0 && (
                 <div className="col-span-full py-8 text-center text-zinc-500 text-sm">
                   No products found.
                 </div>
               )}
            </div>
          </div>
        </div>
      ) : adminTab === 'reports' ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">User Reports</h3>
          {reports.length === 0 ? (
            <div className="text-zinc-500 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 text-center">No pending reports.</div>
          ) : (
            reports.map(rep => (
              <div key={rep.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-red-500 mb-1">Broken Link Reported</h4>
                    <p className="font-bold text-white text-lg">{rep.movieTitle} {rep.episodeTitle ? ` - ${rep.episodeTitle}` : ''}</p>
                    <p className="text-xs text-zinc-400 mt-1">Failed URL: <span className="text-zinc-500 break-all">{rep.failedUrl}</span></p>
                    {rep.description && <div className="mt-2 bg-zinc-950 p-2 rounded text-sm text-zinc-300 border border-zinc-800"><span className="text-zinc-500 font-bold block mb-1">User Comment:</span>{rep.description}</div>}
                  </div>
                  <button onClick={() => resolveReport(rep.id)} className="bg-green-600/20 text-green-500 hover:bg-green-600/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">Mark Resolved</button>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg mt-2">
                   <p className="text-xs text-zinc-400 mb-2">Quick Update (Link 1):</p>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       id={`quick-url-${rep.id}`}
                       placeholder="Enter new working URL..." 
                       className="flex-1 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" 
                     />
                     <button 
                       onClick={async () => {
                         const inp = document.getElementById(`quick-url-${rep.id}`) as HTMLInputElement;
                         if(!inp || !inp.value) return;
                         try {
                           const movieRef = doc(db, 'SanFlix_Content', rep.movieId);
                           if (rep.episodeTitle && rep.episodeIdx !== undefined) {
                             // Get movie first to update specific episode
                             const mSnap = contentList.find(m => m.firebase_id === rep.movieId);
                             if (mSnap && mSnap.episodes) {
                               const eps = [...mSnap.episodes];
                               if (eps[rep.episodeIdx]) {
                                 eps[rep.episodeIdx].url = inp.value;
                                 await updateDoc(movieRef, { episodes: eps });
                               }
                             }
                           } else {
                             await updateDoc(movieRef, { streaming_link_1: inp.value });
                           }
                           await deleteDoc(doc(db, 'SanFlix_Reports', rep.id));
                         } catch(e) {
                           console.error('Failed to update');
                         }
                       }}
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                     >
                       Update & Resolve
                     </button>
                     <button
                       onClick={() => {
                          const item = contentList.find(m => m.firebase_id === rep.movieId);
                          if(item) {
                            setAdminTab('content');
                            editItem(item);
                          }
                       }}
                       className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-700 transition"
                     >
                       Full Edit
                     </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : ( <>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Scraper / Manual Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        
        {/* TMDB Scraper Area */}
        {isWizardMode && wizardQueue.length > 0 && (
           <div className="bg-gradient-to-r from-red-900/40 to-red-600/20 border border-red-500/50 rounded-xl p-4 mb-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                 <div className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                    Pending Wizard
                 </div>
                 <div className="text-sm font-semibold text-zinc-200">
                    Item {trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).length - wizardQueue.length + 1} of {trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).length}
                 </div>
              </div>
              <button 
                 type="button" 
                 onClick={skipWizardItem}
                 className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                 Skip to Next
              </button>
           </div>
        )}
        <div className="flex gap-2 border-b border-zinc-800 pb-5 mb-5">
          <input
            type="text"
            value={tmdbQuery}
            onChange={(e) => setTmdbQuery(e.target.value)}
            placeholder="Scrape by Title, ID, or Link (TMDb/IMDb)..."
            className="flex-1 bg-zinc-950 border border-zinc-700 py-2.5 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
          />
          <button 
            type="button"
            onClick={() => scourCatalogTMDbApi()}
            disabled={tmdbLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {tmdbLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">TMDb / IMDb ID or Link</label>
              <input type="text" name="tmdb_id" value={formData.tmdb_id} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Synopsis</label>
            <textarea name="synopsis" rows={3} value={formData.synopsis} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Cast & Crew</label>
              <input type="text" name="cast_crew" value={formData.cast_crew} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Rating</label>
              <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="e.g. 8.5" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Poster URL</label>
              <input type="text" name="poster_url" value={formData.poster_url} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              {formData.poster_url && (
                <div className="mt-2 h-32 rounded bg-zinc-900 overflow-hidden border border-zinc-800">
                  <img src={formData.poster_url} alt="Poster preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Backdrop URL</label>
              <input type="text" name="backdrop_url" value={formData.backdrop_url} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              {formData.backdrop_url && (
                <div className="mt-2 h-32 rounded bg-zinc-900 overflow-hidden border border-zinc-800">
                  <img src={formData.backdrop_url} alt="Backdrop preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Ad Gate Toggle (Restricted Vault) */}
          <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl flex items-center justify-between mt-6">
            <div className="flex gap-3 items-center">
              <Lock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-bold text-white">Route and Classify as 18+ Hub (Restricted Vault)</p>
                <p className="text-xs text-red-400">Lock behind verification and show premium adult networks</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="ad_gate" checked={formData.ad_gate} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Media Format</label>
              <select name="media_layout_format" value={formData.media_layout_format} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none">
                <option value="Movie Category">Movie Category</option>
                <option value="TV Shows">TV Shows</option>
                <option value="Web Series">Web Series</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Categories (Tags)</label>
              <div className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded-lg text-sm focus-within:border-red-500 mb-2 min-h-[42px] flex flex-wrap gap-2 items-center">
                {formData.mapped_category_rail ? formData.mapped_category_rail.split(',').map(c => c.trim()).filter(Boolean).map((cat, idx) => (
                  <span key={idx} className="bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1 text-xs">
                    {cat}
                    <button 
                      type="button" 
                      onClick={() => {
                        const cats = formData.mapped_category_rail.split(',').map(c => c.trim()).filter(Boolean);
                        setFormData(prev => ({ ...prev, mapped_category_rail: cats.filter(c => c !== cat).join(', ') }));
                      }}
                      className="hover:text-red-300 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )) : null}
                <input 
                  type="text" 
                  placeholder="Add category & press Enter..." 
                  className="bg-transparent outline-none flex-1 min-w-[150px] text-white text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                         const current = formData.mapped_category_rail ? formData.mapped_category_rail.split(',').map(c => c.trim()).filter(Boolean) : [];
                         if (!current.includes(val)) {
                            setFormData(prev => ({ ...prev, mapped_category_rail: [...current, val].join(', ') }));
                         }
                         e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-zinc-500 w-full mb-0.5">Quick Add Suggestions:</span>
                {currentCategories.map(cat => {
                  const isSelected = formData.mapped_category_rail?.split(',').map(c => c.trim()).filter(Boolean).includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const current = prev.mapped_category_rail ? prev.mapped_category_rail.split(',').map(c => c.trim()).filter(Boolean) : [];
                          if (!current.includes(cat)) {
                            return { ...prev, mapped_category_rail: [...current, cat].join(', ') };
                          } else {
                            return { ...prev, mapped_category_rail: current.filter(c => c !== cat).join(', ') };
                          }
                        });
                      }}
                      className={`px-2 py-1 rounded text-[10px] transition-colors border ${isSelected ? 'bg-red-600/20 border-red-500/30 text-red-400' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400'}`}
                    >
                      {isSelected ? '✓ ' : '+ '} {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Release Date</label>
              <input type="text" name="release_date" value={formData.release_date} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Seasons</label>
              <input type="number" name="season_count" value={formData.season_count} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Episodes</label>
              <input type="number" name="eps_count" value={formData.eps_count} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-800 mt-4">
            <h4 className="text-sm font-semibold text-zinc-300 flex items-center justify-between">
                <span>Streaming Links & Episodes</span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, episodes: [...(prev.episodes || []), { title: `Episode ${(prev.episodes?.length || 0) + 1}`, url: '', url_2: '', url_3: '', url_4: '', download_url: '' }] }))}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded border border-zinc-700 transition"
                >
                  <Plus className="w-3 h-3 inline mr-1" /> Add Episode
                </button>
            </h4>
            
            {/* Primary Global Streaming Link (Also backwards compatibility) */}
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Global Streaming Link (For standalone movies) *</label>
                <input type="text" name="streaming_link_1" value={formData.streaming_link_1} onChange={handleInputChange} placeholder="SERVER 1: Primary Stream URL (Any Direct Network Link)" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 2 (Backup)</label>
                   <input type="text" name="streaming_link_2" value={formData.streaming_link_2} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 3 (Backup)</label>
                   <input type="text" name="streaming_link_3" value={formData.streaming_link_3} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] text-zinc-500 mb-1">Server 4 (Backup)</label>
                   <input type="text" name="streaming_link_4" value={formData.streaming_link_4} onChange={handleInputChange} placeholder="Backup URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Stream Type (How should the app open this link?)</label>
                <select name="stream_type" value={formData.stream_type} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none">
                  <option value="Auto-Detect">Auto-Detect (Recommended)</option>
                  <option value="User Choice">Let User Choose (Shows 3 Options)</option>
                  <option value="Direct Streaming">Direct Streaming (In-App Player)</option>
                  <option value="External App">External App (MX Player / VLC)</option>
                  <option value="In-App Web Player">In-App Web Player (React Player/Embed)</option>
                  <option value="External Browser">External Browser Redirect (Chrome)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Episodes */}
            <div className="space-y-4 mt-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {formData.episodes?.map((ep, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ep.title}
                      onChange={(e) => {
                         const newEps = [...formData.episodes];
                         newEps[idx].title = e.target.value;
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      placeholder="E.g. Episode 1"
                      className="w-1/3 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={ep.url}
                      onChange={(e) => {
                         const newEps = [...formData.episodes];
                         newEps[idx].url = e.target.value;
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      placeholder="Direct Streaming URL (Server 1)"
                      className="flex-1 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                         const newEps = formData.episodes.filter((_, i) => i !== idx);
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 rounded-lg border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={ep.url_2 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_2=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 2 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                    <input type="text" value={ep.url_3 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_3=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 3 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                    <input type="text" value={ep.url_4 || ''} onChange={(e) => { const newEps=[...formData.episodes]; newEps[idx].url_4=e.target.value; setFormData(prev=>({ ...prev, episodes: newEps})); }} placeholder="Server 4 (Backup)" className="w-full bg-zinc-900 border border-zinc-700 py-1.5 px-3 rounded-lg text-xs focus:border-red-500 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ep.download_url || ''}
                      onChange={(e) => {
                         const newEps = [...formData.episodes];
                         newEps[idx].download_url = e.target.value;
                         setFormData(prev => ({ ...prev, episodes: newEps }));
                      }}
                      placeholder="Direct Download URL (Optional)"
                      className="w-full bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
              <input type="checkbox" id="direct_streaming" name="is_direct_streaming" checked={formData.is_direct_streaming} onChange={handleInputChange} className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900" />
              <label htmlFor="direct_streaming" className="text-sm text-zinc-300 font-medium">Direct Streaming Mode (Multi-Language Native Player)</label>
            </div>

            {formData.is_direct_streaming && (
              <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-xs font-bold text-zinc-300">Language Audio Streams</h5>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, language_urls: [...(prev.language_urls || []), { language: '', url: '' }] }))}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded border border-zinc-700 transition"
                  >
                    <Plus className="w-3 h-3 inline mr-1" /> Add Language
                  </button>
                </div>
                {formData.language_urls?.map((langObj, idx) => (
                  <div key={`lang-${idx}`} className="flex gap-2">
                    <input
                      type="text"
                      value={langObj.language}
                      onChange={(e) => {
                         const newLangs = [...(formData.language_urls || [])];
                         newLangs[idx].language = e.target.value;
                         setFormData(prev => ({ ...prev, language_urls: newLangs }));
                      }}
                      placeholder="Language (e.g. Hindi)"
                      className="w-1/3 bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={langObj.url}
                      onChange={(e) => {
                         const newLangs = [...(formData.language_urls || [])];
                         newLangs[idx].url = e.target.value;
                         setFormData(prev => ({ ...prev, language_urls: newLangs }));
                      }}
                      placeholder="Stream URL (Any Network Link)"
                      className="flex-1 bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                         const newLangs = formData.language_urls?.filter((_, i) => i !== idx);
                         setFormData(prev => ({ ...prev, language_urls: newLangs || [] }));
                      }}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 rounded-lg border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 mt-2 border-t border-zinc-800">
              <label className="block text-[10px] text-zinc-500 mb-1">YouTube Trailer ID</label>
              <input type="text" name="trailer_id" value={formData.trailer_id} onChange={handleInputChange} placeholder="YouTube Trailer ID (e.g. d9MyW72ELq0)" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
            </div>

            <div className="pt-2 mt-2 border-t border-zinc-800">
              <label className="block text-[10px] text-zinc-500 mb-1">Stream / Download Links (4 Qualities)</label>
              <div className="space-y-2">
                <input type="text" name="download_link_480p" value={formData.download_link_480p} onChange={handleInputChange} placeholder="480p Stream/Download URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                <input type="text" name="download_link_720p" value={formData.download_link_720p} onChange={handleInputChange} placeholder="720p Stream/Download URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                <input type="text" name="download_link_1080p" value={formData.download_link_1080p} onChange={handleInputChange} placeholder="1080p Stream/Download URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
                <input type="text" name="download_link_hdr" value={formData.download_link_hdr} onChange={handleInputChange} placeholder="HDR Stream/Download URL" className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <input type="checkbox" id="sanflixpro" name="is_sanflix_pro" checked={formData.is_sanflix_pro} onChange={handleInputChange} className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900" />
            <label htmlFor="sanflixpro" className="text-sm text-zinc-300 font-medium">Add to Premium Content (Premium Content)</label>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <input type="checkbox" id="phublive" name="is_phub_live" checked={formData.is_phub_live} onChange={handleInputChange} className="rounded border-zinc-700 text-orange-500 focus:ring-orange-500 bg-zinc-900" />
            <label htmlFor="phublive" className="text-sm text-orange-500 font-bold">Mark as Porn Hub LIVE (Requires 18+ Category)</label>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <input type="checkbox" id="highlight" name="is_highlighted" checked={formData.is_highlighted} onChange={handleInputChange} className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900" />
            <label htmlFor="highlight" className="text-sm text-zinc-300 font-medium">Set as Spotlight Banner</label>
          </div>

          <div className="flex gap-3 pt-6">
            <button 
              type="submit" 
              disabled={submitLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
            >
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? <Save className="w-5 h-5"/> : <Plus className="w-5 h-5" />}
              {editingId ? 'Save Changes' : 'Inject Package'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Content Library 
              <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">
                {filteredContent.length}
              </span>
            </h3>
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <input 
                type="checkbox" 
                checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                onChange={toggleAllSelection}
                className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900 w-4 h-4 cursor-pointer" 
              />
              <span className="text-xs text-zinc-400 font-semibold cursor-pointer select-none" onClick={toggleAllSelection}>All</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search uploads..." 
                value={contentSearchTerm}
                onChange={(e) => setContentSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 py-2 pl-9 pr-3 rounded-lg text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex bg-zinc-900 rounded-lg p-1 shrink-0 border border-zinc-800">
              <button 
                onClick={() => setContentTab('Normal')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${contentTab === 'Normal' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Normal
              </button>
              <button 
                onClick={() => setContentTab('18+')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${contentTab === '18+' ? 'bg-red-900/50 text-red-500' : 'text-zinc-400 hover:text-red-400/50'}`}
              >
                18+ Adult
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredContent.map((item, idx) => (
            <div key={item.firebase_id || `item-${idx}`} className={`bg-zinc-900/50 border ${selectedItems.includes(item.firebase_id) ? 'border-red-500/50 bg-red-950/10' : 'border-zinc-800'} rounded-xl p-3 flex gap-4 transition-colors`}>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item.firebase_id)}
                  onChange={() => toggleSelection(item.firebase_id)}
                  className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900 w-5 h-5 cursor-pointer" 
                />
              </div>
              <div className="w-16 h-24 bg-zinc-800 rounded-md overflow-hidden shrink-0">
                {item.poster_url ? (
                  <img src={item.poster_url} className="w-full h-full object-cover" alt={item.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">No Img</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col py-1 overflow-hidden">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm leading-tight text-white truncate">{item.title}</h4>
                  {item.ad_gate && <Lock className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                </div>
                
                <span className="text-[10px] text-zinc-400 mt-1">{item.mapped_category_rail} • {item.media_layout_format}</span>
                <span className="text-[10px] text-zinc-500 line-clamp-1 mt-1">{item.streaming_link_1}</span>
                
                <div className="flex gap-2 mt-auto justify-end">
                  <button 
                    onClick={() => editItem(item)}
                    className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(item.firebase_id, item.title)}
                    className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredContent.length === 0 && (
            <div className="text-center py-10 text-zinc-500 text-sm bg-zinc-900/30 border border-zinc-800 rounded-xl border-dashed">
              No {contentTab} content found.
            </div>
          )}
        </div>
      </div>


      </>)}
      {/* Floating Bulk Action Bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 px-6 py-4 rounded-full flex items-center gap-6">
          <span className="text-sm font-bold text-white">
            {selectedItems.length} selected
          </span>
          <button 
            onClick={deleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete Selected
          </button>
          <button 
            onClick={() => setSelectedItems([])}
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
