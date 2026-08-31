const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetStr = `  const previousUrl = useRef(url);
  useEffect(() => {
    if (!videoRef.current) return;
    
    try {
      // Destroy previous HLS instance if it exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

    const time = previousUrl.current !== url ? videoRef.current.currentTime : 0;
    const wasPlaying = previousUrl.current !== url ? !videoRef.current.paused : true;
    previousUrl.current = url;`;

const newStr = `  const isFirstLoad = useRef(true);
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
    previousUrl.current = url;`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
