const fs = require('fs');
let content = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

const replacement = `
                           onClick={() => {
                              const cleanStr = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                              const sugClean = cleanStr(sug.title);
                              let found = availableMovies.find(m => 
                                cleanStr(m.title) === sugClean || 
                                (sug.id && (m.id === sug.id || m.firebase_id === sug.id))
                              );
                              
                              if (!found) {
                                found = availableMovies.find(m => 
                                  cleanStr(m.title).includes(sugClean) || 
                                  sugClean.includes(cleanStr(m.title))
                                );
                              }
                              
                              if (found && onSelectMovie) {
                                 onSelectMovie(found);
                                 onClose();
                              } else if (onSelectMovie) {
                                 // Create a mock object so user sees something
                                 onSelectMovie({
                                   id: sug.id || 'ai-' + Date.now(),
                                   title: sug.title,
                                   poster_url: sug.imageUrl,
                                   description: "Recommended by SanFlix AI. We are currently locating streaming sources for this title.",
                                   genres: ["AI Recommendation"]
                                 });
                                 onClose();
                              }
                           }} 
`;

content = content.replace(/onClick=\{\(\) => \{\n\s*const found = availableMovies\.find[\s\S]*?console\.log\("Not in local DB:", sug\.title\);\n\s*\}\n\s*\}\}/, replacement);

fs.writeFileSync('src/components/ChatBot.tsx', content);
