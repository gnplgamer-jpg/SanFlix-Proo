const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

const pipRegex = /<PictureInPicture className="w-5 h-5" \/>\s*<\/button>\s*\)\}/;
const pipReplacement = `<PictureInPicture className="w-5 h-5" />
                </button>
              )}
              {/* Cast Button */}
              <button 
                onClick={() => {
                  if ((window as any).cast && (window as any).chrome) {
                    alert("Google Cast API detected. Ensure you are connected to the same Wi-Fi as your Cast device.");
                    // Basic sender trigger if available
                  } else {
                    alert("Chromecast is not supported in this browser or extension is missing.");
                  }
                }} 
                className="bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition text-white shadow-lg border border-white/10 tooltip-trigger hidden sm:block"
                title="Cast to TV"
              >
                <Cast className="w-5 h-5" />
              </button>`;

code = code.replace(pipRegex, pipReplacement);
fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Added Cast Button');
