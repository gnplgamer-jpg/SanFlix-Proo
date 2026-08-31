const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetStr = `  const isFirstLoad = useRef(true);`;
const newStr = `  const isFirstLoad = useRef(true);
  const initialTimeApplied = useRef(false);`;
code = code.replace(targetStr, newStr);

const targetOnLoaded = `             onLoadedMetadata={() => {
                if (initialTime > 0 && isFirstLoad.current) {
                  videoRef.current.currentTime = initialTime;
                  // isFirstLoad will be flipped to false in the useEffect
                }
             }}`;
const newOnLoaded = `             onLoadedMetadata={() => {
                if (initialTime > 0 && !initialTimeApplied.current) {
                  videoRef.current.currentTime = initialTime;
                  initialTimeApplied.current = true;
                }
             }}`;
code = code.replace(targetOnLoaded, newOnLoaded);

const hlsTime = `        if (videoRef.current) {
          videoRef.current.currentTime = time;`;
const newHlsTime = `        if (videoRef.current) {
          videoRef.current.currentTime = time;
          if (time === initialTime && time > 0) initialTimeApplied.current = true;`;
code = code.replace(hlsTime, newHlsTime);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
