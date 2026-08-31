const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

// For trailer
code = code.replace(
  `<div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center">
                <iframe
                  src={\`https://www.youtube.com/embed/\${movie.trailer_id}?autoplay=1&rel=0&modestbranding=1\`}
                  className="w-full h-full max-h-[80vh] border-0 rounded-xl shadow-2xl"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
            </div>`,
  `<div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center">
                <div className="w-full aspect-video max-h-[80vh]">
                  <iframe
                    src={\`https://www.youtube.com/embed/\${movie.trailer_id}?autoplay=1&rel=0&modestbranding=1\`}
                    className="w-full h-full border-0 rounded-xl shadow-2xl bg-zinc-900"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
            </div>`
);

// For embeddedUrl
code = code.replace(
  `<div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center relative">
                <iframe
                  src={embeddedUrl}
                  className="w-full h-full max-h-[80vh] border-0 rounded-xl shadow-2xl bg-zinc-900 relative z-0"
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
            </div>`,
  `<div className="w-full h-full pt-20 pb-10 px-4 sm:px-10 max-w-6xl mx-auto flex items-center justify-center relative">
                <div className="w-full aspect-video max-h-[80vh]">
                  <iframe
                    src={embeddedUrl}
                    className="w-full h-full border-0 rounded-xl shadow-2xl bg-zinc-900 relative z-0"
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                  />
                </div>
            </div>`
);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
console.log("iframe fixed");
