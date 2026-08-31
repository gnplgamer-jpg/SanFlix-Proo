const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetUseEffect = `  useEffect(() => {
    setUrl(initialUrl);
    setFallbackIndex(0);
  }, [initialUrl]);`;

const replaceUseEffect = `  useEffect(() => {
    setUrl(initialUrl);
    setFallbackIndex(0);
    setHasError(false);
  }, [initialUrl]);`;

code = code.replace(targetUseEffect, replaceUseEffect);

const targetHandleVideoError = `  const handleVideoError = () => {
    if (fallbackIndex < fallbackUrls.length) {
      console.log('Falling back to next URL...', fallbackUrls[fallbackIndex]);
      setUrl(fallbackUrls[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
    } else {`;

const replaceHandleVideoError = `  const handleVideoError = () => {
    if (fallbackIndex < fallbackUrls.length) {
      console.log('Falling back to next URL...', fallbackUrls[fallbackIndex]);
      setUrl(fallbackUrls[fallbackIndex]);
      setFallbackIndex(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
    } else {`;

code = code.replace(targetHandleVideoError, replaceHandleVideoError);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
