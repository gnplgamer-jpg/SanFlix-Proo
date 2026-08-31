const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetInitUrl = `  let url = extractedUrl?.includes('pixeldrain') && extractedUrl?.includes('?download') ? extractedUrl.replace('?download', '') : extractedUrl;

  // Proxy Google Drive links to strip Content-Disposition headers and bypass browser download prompt
  if (url?.includes('drive.google.com')) {
    url = \`/api/proxy/video?url=\${encodeURIComponent(url)}\`;
  }`;

const replaceInitUrl = `  let initialUrl = extractedUrl?.includes('pixeldrain') && extractedUrl?.includes('?download') ? extractedUrl.replace('?download', '') : extractedUrl;

  // Proxy Google Drive links to strip Content-Disposition headers and bypass browser download prompt
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

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
