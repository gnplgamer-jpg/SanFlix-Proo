const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetOnError = `              onError={(e) => {
               console.warn("Video error caught, checking fallback options...");
               if (videoRef.current) {
                 const currentSrc = videoRef.current.currentSrc;
                 
                 if (videoRef.current.error) {
                    setIsLoading(false);
                    setHasError(true);
                 } else if (currentSrc) {`;

const replacementOnError = `              onError={(e) => {
               console.warn("Video error caught, checking fallback options...");
               if (videoRef.current) {
                 const currentSrc = videoRef.current.currentSrc;
                 
                 if (videoRef.current.error) {
                    setIsLoading(false);
                    if (fallbackIndex < fallbackUrls.length) {
                       handleVideoError();
                    } else {
                       setHasError(true);
                    }
                 } else if (currentSrc) {`;

code = code.replace(targetOnError, replacementOnError);

const hlsErrorFatal = `            default:
              console.error("Unrecoverable error:", data.details);
              hls.destroy();
              if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
              }
              break;`;

const newHlsErrorFatal = `            default:
              console.error("Unrecoverable error:", data.details);
              hls.destroy();
              if (fallbackIndex < fallbackUrls.length) {
                 handleVideoError();
              } else if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
              }
              break;`;
code = code.replace(hlsErrorFatal, newHlsErrorFatal);

// And we must ensure the Quality/Settings/Language controls are NOT hidden by the error overlay.
// The user said: "quality changer ye sab hide nhi hina chaa hiye"
// The error overlay currently uses: `className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto"`
// The controls are `z-30`. So if we just change the error overlay `z-50` to `z-20`?
// Wait, if it's `z-20`, then controls at `z-30` will overlay ON TOP of it!
// Let's change the error overlay's z-index to `z-20`.

code = code.replace(
  'className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto"',
  'className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20 pointer-events-auto"'
);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
