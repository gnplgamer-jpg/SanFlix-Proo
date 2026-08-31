const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

code = code.replace(
  "  fallbackUrls?: string[];\n  onReport?: () => void;\n}",
  "  fallbackUrls?: string[];\n  onReport?: () => void;\n  initialTime?: number;\n}"
);

code = code.replace(
  "  fallbackUrls = [],\n  onReport\n}: DirectVideoPlayerProps)",
  "  fallbackUrls = [],\n  onReport,\n  initialTime = 0\n}: DirectVideoPlayerProps)"
);

const mountEffect = `  useEffect(() => {
    // Attempt auto-play on mount
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Auto-play failed, usually due to browser policy:", error);
        });
      }
    }
  }, []);`;

const newMountEffect = `  useEffect(() => {
    // Attempt auto-play on mount
    if (videoRef.current) {
      if (initialTime > 0) {
        videoRef.current.currentTime = initialTime;
      }
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Auto-play failed, usually due to browser policy:", error);
        });
      }
    }
  }, [initialTime]);`;

code = code.replace(mountEffect, newMountEffect);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
