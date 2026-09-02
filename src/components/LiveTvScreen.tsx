import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, Search, AlertCircle, Loader2, SignalHigh, Flame, WifiOff, Heart, Settings, Maximize, PictureInPicture, Cast, SlidersHorizontal, Flag, MessageSquare } from 'lucide-react';
import Hls from 'hls.js';
import { db, collection, addDoc } from '../firebase';

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
  fallbackUrls?: string[];
  nowPlaying?: string;
}

// Fallback channels in case M3U parsing fails or hits CORS
const FALLBACK_CHANNELS: Channel[] = [
  {
    "id": "1",
    "name": "Star Plus",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Plus_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "2",
    "name": "Sony Entertainment Television",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "3",
    "name": "Colors",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Colors_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "4",
    "name": "Zee TV",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_TV_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "5",
    "name": "Star Bharat",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Bharat_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "6",
    "name": "Sony SAB",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_SAB_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "7",
    "name": "Dangal",
    "category": "Hindi GEC",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Dangal.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "8",
    "name": "Star Gold",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Gold_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "9",
    "name": "Sony MAX",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Max_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "10",
    "name": "Zee Cinema",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Cinema_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "11",
    "name": "Colors Cineplex",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Colors_Cineplex_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "12",
    "name": "B4U Movies",
    "category": "Hindi Movies",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Movies.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "13",
    "name": "Star Sports 1",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Sports_1_HD.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "14",
    "name": "Sony Ten 1",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_Ten_1_HD.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "15",
    "name": "Sports18 1 HD",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sports18_1_HD.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "16",
    "name": "Eurosport India",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Eurosport_HD.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "17",
    "name": "DD Sports",
    "category": "Sports",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/DD_Sports.png",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "18",
    "name": "Cartoon Network",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Cartoon_Network.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "19",
    "name": "Pogo TV",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Pogo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "20",
    "name": "Nickelodeon",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Nick.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "21",
    "name": "Disney Channel",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Disney.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "22",
    "name": "Sony YAY!",
    "category": "Kids",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_YAY.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "23",
    "name": "Discovery Channel",
    "category": "Infotainment",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Discovery_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "24",
    "name": "National Geographic",
    "category": "Infotainment",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Nat_Geo_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "25",
    "name": "History TV18",
    "category": "Infotainment",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/History_TV18_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "26",
    "name": "Animal Planet",
    "category": "Infotainment",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Animal_Planet_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "27",
    "name": "Aaj Tak",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Aaj_Tak.png",
    "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "28",
    "name": "ABP News",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/ABP_News.png",
    "url": "https://abp-i.akamaihd.net/hls/live/765529/abphindi/master.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "29",
    "name": "India TV",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/India_TV.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "30",
    "name": "Zee News",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_News.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "31",
    "name": "News18 India",
    "category": "News",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/News18_India.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "32",
    "name": "MTV",
    "category": "Music",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/MTV_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "33",
    "name": "9XM",
    "category": "Music",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/9XM.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "34",
    "name": "Zoom",
    "category": "Music",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zoom.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "35",
    "name": "B4U Music",
    "category": "Music",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/B4U_Music.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "36",
    "name": "DD National",
    "category": "Doordarshan",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/DD_National.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "37",
    "name": "DD News",
    "category": "Doordarshan",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/DD_News.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "38",
    "name": "Zee Marathi",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Zee_Marathi_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "39",
    "name": "Star Jalsha",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Star_Jalsha_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "40",
    "name": "Sun TV",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sun_TV_HD.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "41",
    "name": "PTC Punjabi",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/PTC_Punjabi.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "42",
    "name": "Bhojpuri Cinema",
    "category": "Regional",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Bhojpuri_Cinema.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "43",
    "name": "Nepal Television (NTV)",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/2/23/Nepal_Television_Logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "44",
    "name": "Kantipur TV HD",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Kantipur_Television_Logo.png/220px-Kantipur_Television_Logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "45",
    "name": "AP1 HD",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Ap1_logo.png/220px-Ap1_logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "46",
    "name": "Himalaya TV",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Himalaya_TV.jpg/200px-Himalaya_TV.jpg",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  },
  {
    "id": "47",
    "name": "News24 Nepal",
    "category": "Nepal",
    "logo": "https://upload.wikimedia.org/wikipedia/en/4/4e/News24_Nepal_logo.png",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "nowPlaying": "Live Stream"
  }
];

interface LiveTvScreenProps {
  user?: any;
  onRequirePremium?: (expired: boolean) => void;
}

export function LiveTvScreen({ user, onRequirePremium }: LiveTvScreenProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(() => {
    try {
      const pending = localStorage.getItem('pendingLiveChannel');
      if (pending) {
        const parsed = JSON.parse(pending);
        return FALLBACK_CHANNELS.find(c => c.name === parsed.name) || parsed;
      }
    } catch(e) {}
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [qualities, setQualities] = useState<{height: number, level: number}[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [audioTracks, setAudioTracks] = useState<{id: number, name: string}[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(-1);
  const [videoFilters, setVideoFilters] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_LIVETV_FAVORITES');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [trialTimeLeft, setTrialTimeLeft] = useState<number | null>(null);

  const toggleFavorite = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(channelId) 
        ? prev.filter(id => id !== channelId) 
        : [...prev, channelId];
      localStorage.setItem('SANFLIX_LIVETV_FAVORITES', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const isPremium = user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true';
    if (isPremium) {
       setTrialTimeLeft(null);
       return;
    }

    const checkTrial = () => {
       const expiryStr = localStorage.getItem('SANFLIX_LIVE_TRIAL_EXPIRY');
       if (!expiryStr) {
          // No trial started
          setTrialTimeLeft(0);
          if (isPlaying && onRequirePremium) {
             videoRef.current?.pause();
             setIsPlaying(false);
             onRequirePremium(false);
          }
          return;
       }
       
       const expiry = parseInt(expiryStr);
       const now = Date.now();
       if (now >= expiry) {
          // Trial expired
          setTrialTimeLeft(0);
          if (isPlaying && onRequirePremium) {
             videoRef.current?.pause();
             setIsPlaying(false);
             onRequirePremium(true);
          }
       } else {
          setTrialTimeLeft(Math.floor((expiry - now) / 1000));
       }
    };

    checkTrial();
    const timer = setInterval(checkTrial, 1000);


  return () => clearInterval(timer);
  }, [isPlaying, user]);
  
  // Format MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const submitReport = async () => {
    if (!currentChannel) return;
    try {
      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieTitle: `Live TV: ${currentChannel.name}`,
        failedUrl: currentChannel.url,
        description: reportText,
        type: 'LiveTV',
        timestamp: new Date().toISOString()
      });
      setShowReportModal(false);
      setReportText('');
      alert("Report sent to Admin. Thank you!");
    } catch(e) {
      console.error(e);
      alert("Error sending report.");
    }
  };


  useEffect(() => {
    // Simulated M3U Fetching & Parsing
                const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('https://iptv-org.github.io/iptv/countries/in.m3u');
          const m3u = await response.text();
          
          const lines = m3u.split('\n');
          let currentCh: Partial<Channel> = {};
          
          const channelMap = new Map<string, Channel>();

          for (const line of lines) {
            if (line.startsWith('#EXTINF:')) {
              const logoMatch = line.match(/tvg-logo="([^"]+)"/);
              const groupMatch = line.match(/group-title="([^"]+)"/);
              const commaIndex = line.lastIndexOf(',');
              const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown';
              
              currentCh = {
                id: 'iptv_' + Math.random().toString(36).substr(2, 9),
                logo: logoMatch ? logoMatch[1] : '',
                category: groupMatch ? groupMatch[1] : 'Other',
                name: name,
                nowPlaying: 'Live Stream'
              };
            } else if (line.trim() !== '' && !line.startsWith('#')) {
              currentCh.url = line.trim();
              if (currentCh.name && currentCh.url) {
                const existing = channelMap.get(currentCh.name.toLowerCase());
                if (existing) {
                   if (!existing.fallbackUrls) existing.fallbackUrls = [];
                   existing.fallbackUrls.push(currentCh.url);
                } else {
                   channelMap.set(currentCh.name.toLowerCase(), currentCh as Channel);
                }
              }
              currentCh = {};
            }
          }
          const iptvChannels = Array.from(channelMap.values());
          const allChannels = [...FALLBACK_CHANNELS, ...iptvChannels];
          setChannels(allChannels);
          
          let selected = currentChannel || allChannels[0];
          localStorage.removeItem('pendingLiveChannel');
          if (!currentChannel) {
            setCurrentChannel(selected);
          }
        } catch (err) {
          console.error("M3U fetch error", err);
          setChannels(FALLBACK_CHANNELS);
          if (!currentChannel) {
            setCurrentChannel(FALLBACK_CHANNELS[0]);
          }
        } finally {
          setIsLoading(false);
        }
      };

    fetchPlaylists();
  }, []);

  // Handle Video Playback
  useEffect(() => {
    if (!currentChannel || !videoRef.current) return;

    setPlayerError(false);
    setIsPlaying(false);

    
    const urlsToTry = [currentChannel.url, ...(currentChannel.fallbackUrls || [])];
    const activeUrl = urlsToTry[fallbackIndex] || currentChannel.url;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30, 
        maxMaxBufferLength: 60,
        startLevel: -1,
        capLevelToPlayerSize: true,
      });
      hlsRef.current = hls;

      hls.loadSource(activeUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableAudio = hls.audioTracks.map((t: any, i: number) => ({ id: i, name: t.name || t.language || 'Track ' + (i+1) }));
        setAudioTracks(availableAudio);
        setCurrentAudio(hls.audioTrack);
        const availableQualities = data.levels.map((l, i) => ({ height: l.height, level: i }));
        setQualities(availableQualities);
        videoRef.current?.play().catch(e => console.warn("Autoplay prevented", e));
        setIsPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try fallback!
              if (fallbackIndex < urlsToTry.length - 1) {
                console.log('Network error, trying fallback URL');
                setFallbackIndex(prev => prev + 1);
              } else {
                hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              if (fallbackIndex < urlsToTry.length - 1) {
                setFallbackIndex(prev => prev + 1);
              } else {
                hls.destroy();
                setPlayerError(true);
              }
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = activeUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current?.play().catch(e => console.warn("Autoplay prevented", e));
        setIsPlaying(true);
      });
      videoRef.current.addEventListener('error', () => {
        setPlayerError(true);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentChannel, fallbackIndex]);

  
  const dynamicCategories = Array.from(new Set(channels.map(c => c.category))).filter(Boolean).sort();
  // Keep core ones first, then alphabetical dynamic ones
  const coreCategories = ['All', 'Favorites', 'Hindi GEC', 'Hindi Movies', 'Sports', 'Kids', 'Infotainment', 'News', 'Music', 'Doordarshan', 'Regional', 'Nepal'];
  const otherCategories = dynamicCategories.filter(c => !coreCategories.includes(c));
  const categories = [...coreCategories, ...otherCategories];

  
    const filteredChannels = channels.filter(c => {
    const matchesCategory = activeCategory === 'All' 
      ? true 
      : activeCategory === 'Favorites'
        ? favorites.includes(c.id)
        : c.category === activeCategory;
    
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950 pb-20">
      
      {/* 1. Top Section: Video Player */}
      <div className="sticky top-0 z-40 bg-zinc-950 shadow-2xl">
        <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
          {playerError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 p-4 text-center">
              <WifiOff className="w-12 h-12 text-red-500 mb-2" />
              <p className="font-bold text-white mb-1">Stream Offline or CORS Blocked</p>
              <p className="text-xs">Try selecting another channel.</p>
            </div>
          ) : (
             <video 
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              style={{ filter: `brightness(${videoFilters.brightness}%) contrast(${videoFilters.contrast}%) saturate(${videoFilters.saturation}%)` }}
            />
          )}

          {/* Premium / Trial Overlay */}
          {!playerError && currentChannel && trialTimeLeft !== null && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-yellow-500 tracking-wider">
                 Trial: {formatTime(trialTimeLeft)}
               </span>
            </div>
          )}

          {/* Block Overlay if expired/not started */}
          {!playerError && currentChannel && trialTimeLeft === 0 && !(user?.isPremium || localStorage.getItem('SANFLIX_PREMIUM') === 'true') && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
               <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                 <Tv className="w-8 h-8 text-yellow-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Live TV is Locked</h3>
               <p className="text-sm text-zinc-400 mb-6 max-w-[250px]">Get a Premium subscription or watch an ad to start your 10-minute trial.</p>
               <button 
                 onClick={() => onRequirePremium && onRequirePremium(false)}
                 className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors shadow-lg"
               >
                 Unlock Now
               </button>
            </div>
          )}

          {/* Advanced Controls */}
          {!playerError && currentChannel && (
            <div className="absolute top-4 right-4 sm:top-auto sm:right-4 sm:bottom-16 flex flex-col sm:flex-row gap-2 z-20">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger"
                title="Player Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowReportModal(true)} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger"
                title="Report / Suggestions"
              >
                <MessageSquare className="w-5 h-5 text-zinc-300" />
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
              {/* Cast Button */}
              <button 
                onClick={() => {
                  if ((window as any).cast && (window as any).chrome) {
                    alert("Google Cast API detected. Ensure you are connected to the same Wi-Fi as your Cast device.");
                    // Basic sender trigger if available
                  } else {
                    alert("Chromecast is not supported in this browser or extension is missing.");
                  }
                }} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger hidden sm:block"
                title="Cast to TV"
              >
                <Cast className="w-5 h-5" />
              </button>
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
              
              {/* Audio Track Selector */}
              {audioTracks.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Audio Language</label>
                  <select 
                    className="w-full bg-zinc-800 text-sm rounded-lg p-2 border border-zinc-700 outline-none"
                    value={currentAudio}
                    onChange={(e) => {
                      const trackId = parseInt(e.target.value);
                      setCurrentAudio(trackId);
                      if (hlsRef.current) {
                        hlsRef.current.audioTrack = trackId;
                      }
                    }}
                  >
                    {audioTracks.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
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
          
          {/* Report Modal */}
          {showReportModal && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm">
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Flag className="text-red-500 w-5 h-5"/> Report Issue / Suggestion</h3>
                 <p className="text-sm text-zinc-400 mb-4">Let the admin know if this stream is broken, or give suggestions for new channels!</p>
                 <textarea 
                   value={reportText}
                   onChange={e => setReportText(e.target.value)}
                   placeholder="Describe the issue (e.g., 'Stream keeps buffering', 'Add Zee Tamil')"
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:border-red-500 h-24 mb-4 resize-none"
                 />
                 <div className="flex gap-2 justify-end">
                   <button onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-400 hover:text-white transition">Cancel</button>
                   <button onClick={submitReport} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition shadow-lg">Submit to Admin</button>
                 </div>
               </div>
            </div>
          )}

          {/* Player Overlays */}
          {!playerError && currentChannel && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
               <div className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </div>
               <span className="text-xs font-bold text-white tracking-wider uppercase">Live</span>
            </div>
          )}
        </div>

        {/* Current Channel Info */}
        {currentChannel && (
          <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-red-500 overflow-hidden flex-shrink-0 shadow-lg shadow-red-500/20">
                 <img 
                   src={currentChannel.logo || `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String(currentChannel.name || 'TV').substring(0,3))}`} 
                   alt={currentChannel.name}
                   className="w-full h-full object-cover bg-white"
                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String((e.currentTarget as any).alt || 'TV').substring(0, 3))}`; }}
                 />
              </div>
              <div className="flex-1 overflow-hidden">
                <h1 className="text-xl font-black text-white truncate">{currentChannel.name}</h1>
                <p className="text-sm text-zinc-400 font-medium truncate">{currentChannel.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Search Bar */}
      <div className="px-4 pt-4 bg-zinc-950 border-b border-zinc-900 sticky top-[auto] z-30">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search live channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
          />
        </div>

        {/* 2. Middle Section: Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-center whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Section: Channel List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-500" />
            <p className="font-bold">Scanning satellites for channels...</p>
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Tv className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-white">No channels found</p>
            <p className="text-sm">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => {
                  setCurrentChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
                onTouchStart={() => {
                  touchTimer.current = setTimeout(() => {
                    setHoveredChannel(channel.id);
                  }, 500);
                }}
                onTouchEnd={() => {
                  if (touchTimer.current) clearTimeout(touchTimer.current);
                  setHoveredChannel(null);
                }}
                onTouchMove={() => {
                  if (touchTimer.current) clearTimeout(touchTimer.current);
                  setHoveredChannel(null);
                }}
                onContextMenu={(e) => {
                  if (hoveredChannel === channel.id) {
                    e.preventDefault();
                  }
                }}
                className={`relative cursor-pointer flex items-center gap-4 p-3 rounded-2xl transition-all border text-left group overflow-hidden ${
                  currentChannel?.id === channel.id 
                    ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800'
                }`}
              >
                {/* Now Playing Overlay */}
                <div 
                  className={`absolute inset-0 bg-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300 ${hoveredChannel === channel.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <span className="text-[10px] text-red-500 font-bold mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    NOW PLAYING
                  </span>
                  <p className="text-white text-xs font-medium line-clamp-3 px-2">
                    {channel.nowPlaying || 'Live Broadcast'}
                  </p>
                </div>
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full overflow-hidden bg-white p-1 flex items-center justify-center ${currentChannel?.id === channel.id ? 'ring-2 ring-red-500' : 'ring-1 ring-zinc-700'}`}>
                    <img 
                      src={channel.logo || `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String(channel.name || 'TV').substring(0,3))}`} 
                      alt={channel.name}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/1f2937/ef4444?text=${encodeURIComponent(String((e.currentTarget as any).alt || 'TV').substring(0, 3))}`; }}
                    />
                  </div>
                  {/* LIVE Badge overlay */}
                  <div className="absolute -top-1 -right-2 bg-red-600 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded text-white shadow-sm uppercase border border-red-900/50">
                    LIVE
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <h3 className={`font-bold truncate ${currentChannel?.id === channel.id ? 'text-red-500' : 'text-zinc-200 group-hover:text-white'}`}>
                    {channel.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium truncate">{channel.category}</p>
                </div>
                
                <div className="flex flex-col gap-2 items-center justify-center shrink-0">
                  <button 
                    onClick={(e) => toggleFavorite(e, channel.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      favorites.includes(channel.id) 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : 'bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(channel.id) ? 'fill-current' : undefined}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
