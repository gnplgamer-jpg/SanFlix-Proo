const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Imports
code = code.replace(/import \{ Play, Tv, Search, AlertCircle, Loader2, SignalHigh, Flame, WifiOff, Heart \} from 'lucide-react';/,
  "import { Play, Tv, Search, AlertCircle, Loader2, SignalHigh, Flame, WifiOff, Heart, Settings, Maximize, PictureInPicture, Cast, SlidersHorizontal, Flag, MessageSquare } from 'lucide-react';");

// 2. Add new States
const stateRegex = /const \[playerError, setPlayerError\] = useState\(false\);/;
const stateReplacement = `const [playerError, setPlayerError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [qualities, setQualities] = useState<{height: number, level: number}[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [videoFilters, setVideoFilters] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');`;

code = code.replace(stateRegex, stateReplacement);

// 3. Reset fallbackIndex when channel changes (search for setCurrentChannel)
// Actually we can just do it in useEffect that handles channel setup.
const effectRegex = /useEffect\(\(\) => \{\s*if \(\!currentChannel\) return;\s*setPlayerError\(false\);/g;
const effectReplacement = `useEffect(() => {
    if (!currentChannel) return;
    setPlayerError(false);
    setFallbackIndex(0);`;
code = code.replace(effectRegex, effectReplacement);

// 4. Update HLS setup to handle fallback and qualities
const hlsInitRegex = /if \(Hls\.isSupported\(\)\) \{[\s\S]*?videoRef\.current\.src = currentChannel\.url;\n      videoRef\.current\.addEventListener\('loadedmetadata'/;
const hlsInitReplacement = `
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
      videoRef.current.addEventListener('loadedmetadata'`;
code = code.replace(hlsInitRegex, hlsInitReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Added states and HLS fallback logic!');
