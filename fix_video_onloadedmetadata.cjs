const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const videoStart = `           <video
             ref={videoRef}
             autoPlay
             preload="auto"`;

const newVideoStart = `           <video
             ref={videoRef}
             autoPlay
             preload="auto"
             onLoadedMetadata={() => {
                if (initialTime > 0 && isFirstLoad.current) {
                  videoRef.current.currentTime = initialTime;
                  // isFirstLoad will be flipped to false in the useEffect
                }
             }}`;

code = code.replace(videoStart, newVideoStart);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
