const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

code = code.replace(
  "const [isAutoRotateOn, setIsAutoRotateOn] = useState(true);",
  "const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);"
);

code = code.replace(
  `      if (isAutoRotateOn) {
        try {
          // @ts-ignore
          if (screen.orientation && screen.orientation.unlock) {
            // @ts-ignore
            screen.orientation.unlock();
          }
        } catch (err) {}
      }`,
  `      if (!isLandscapeLocked) {
        try {
          // @ts-ignore
          if (screen.orientation && screen.orientation.unlock) {
            // @ts-ignore
            screen.orientation.unlock();
          }
        } catch (err) {}
      }`
);

code = code.replace(
  `  const toggleAutoRotate = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    if (isAutoRotateOn) {
      // Turning off auto-rotate -> lock to current
      try {
        if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen().catch(() => {});
        }
        // @ts-ignore
        if (screen.orientation && screen.orientation.lock) {
          const isPortrait = window.innerHeight > window.innerWidth;
          // @ts-ignore
          await screen.orientation.lock(isPortrait ? 'portrait' : 'landscape').catch(() => {});
        }
      } catch (err) {}
      setIsAutoRotateOn(false);
    } else {
      // Turning on auto-rotate -> unlock
      try {
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
          // @ts-ignore
          screen.orientation.unlock();
        }
      } catch (err) {}
      setIsAutoRotateOn(true);
    }
  };`,
  `  const toggleLandscapeLock = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    if (isLandscapeLocked) {
      // Unlock orientation
      try {
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
          // @ts-ignore
          screen.orientation.unlock();
        }
      } catch (err) {}
      setIsLandscapeLocked(false);
    } else {
      // Lock to landscape
      try {
        if (wrapperRef.current?.requestFullscreen && !document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen().catch(() => {});
        }
        // @ts-ignore
        if (screen.orientation && screen.orientation.lock) {
          // @ts-ignore
          await screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (err) {}
      setIsLandscapeLocked(true);
    }
  };`
);

code = code.replace(
  `                 <button 
                   onClick={toggleAutoRotate}
                   className={\`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors \${isAutoRotateOn ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10'}\`}
                 >
                   <Smartphone className={\`w-5 h-5 \${isAutoRotateOn ? 'rotate-90' : ''} transition-transform\`} />
                 </button>`,
  `                 <button 
                   onClick={toggleLandscapeLock}
                   className={\`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors \${isLandscapeLocked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10'}\`}
                   title="Lock to Landscape"
                 >
                   <Smartphone className={\`w-5 h-5 transition-transform \${isLandscapeLocked ? 'rotate-90' : ''}\`} />
                 </button>`
);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
console.log('DirectVideoPlayer.tsx updated');
