const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetProps = `  hasLanguages: boolean;
  hasQualities: boolean;
  hasEpisodes?: boolean;
  onEnded?: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}`;

const replaceProps = `  hasLanguages: boolean;
  hasQualities: boolean;
  hasEpisodes?: boolean;
  onEnded?: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
  fallbackUrls?: string[];
  onReport?: () => void;
}`;

code = code.replace(targetProps, replaceProps);

const targetDestruct = `  hasEpisodes,
  onEnded,
  onProgressUpdate
}: DirectVideoPlayerProps) {
  // Extract video URL if image URL is concatenated with it (e.g., .jpghttps://...)`;

const replaceDestruct = `  hasEpisodes,
  onEnded,
  onProgressUpdate,
  fallbackUrls = [],
  onReport
}: DirectVideoPlayerProps) {
  // Extract video URL if image URL is concatenated with it (e.g., .jpghttps://...)`;

code = code.replace(targetDestruct, replaceDestruct);

// Add currentUrl state to manage fallback
const targetInitUrl = `  let url = extractedUrl?.includes('pixeldrain') && extractedUrl?.includes('?download') ? extractedUrl.replace('?download', '') : extractedUrl;
  
  if (url?.includes('drive.google.com')) {
    url = \`/api/proxy/video?url=\${encodeURIComponent(url)}\`;
  }`;

const replaceInitUrl = `  let initialUrl = extractedUrl?.includes('pixeldrain') && extractedUrl?.includes('?download') ? extractedUrl.replace('?download', '') : extractedUrl;
  
  if (initialUrl?.includes('drive.google.com')) {
    initialUrl = \`/api/proxy/video?url=\${encodeURIComponent(initialUrl)}\`;
  }
  
  const [url, setUrl] = useState(initialUrl);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setUrl(initialUrl);
    setFallbackIndex(0);
  }, [initialUrl]);

  const handleVideoError = () => {
    if (fallbackIndex < fallbackUrls.length) {
      console.log('Falling back to next URL...', fallbackUrls[fallbackIndex]);
      setUrl(fallbackUrls[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
    } else {
      console.error('All fallback URLs failed.');
      if (onReport) onReport();
    }
  };`;

code = code.replace(targetInitUrl, replaceInitUrl);

// Update Hls error handler
const targetHlsError = `            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                 console.warn("Not an HLS stream (manifest parse failed). Falling back to native video...");
                 hls.destroy();
                 if (videoRef.current) {
                   videoRef.current.src = url;
                   videoRef.current.load();
                 }
              } else {
                 console.error("HLS Network Error:", data);
                 hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("HLS Media Error - trying to recover", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal HLS Error:", data);
              hls.destroy();
              break;`;

const replaceHlsError = `            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                 console.warn("Not an HLS stream (manifest parse failed). Falling back to native video...");
                 hls.destroy();
                 if (videoRef.current) {
                   videoRef.current.src = url;
                   videoRef.current.load();
                 }
              } else {
                 console.error("HLS Network Error:", data);
                 // If it fails completely, try fallback
                 if (fallbackUrls && fallbackIndex < fallbackUrls.length) {
                     hls.destroy();
                     handleVideoError();
                 } else {
                     hls.startLoad();
                 }
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("HLS Media Error - trying to recover", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal HLS Error:", data);
              hls.destroy();
              if (fallbackUrls && fallbackIndex <= fallbackUrls.length) {
                  handleVideoError();
              }
              break;`;

code = code.replace(targetHlsError, replaceHlsError);

// Add onError to video element
const targetVideoProps = `            onEnded={onEnded}
            playsInline
          >
             <source src={url} type="video/mp4" />
          </video>`;

const replaceVideoProps = `            onEnded={onEnded}
            onError={handleVideoError}
            playsInline
          >
             <source src={url} type="video/mp4" />
          </video>`;

code = code.replace(targetVideoProps, replaceVideoProps);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
