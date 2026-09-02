const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] shrink-0 bg-zinc-900 flex items-center justify-center">
                            {(() => {
                              const actressName = selectedCategory.replace('Actress: ', '');
                              const actressInfo = predefinedActresses.find(a => a.name === actressName);
                              if (actressInfo?.imageUrl) {
                                return (
                                  <img 
                                    src={actressInfo.imageUrl} 
                                    alt={actressName}
                                    className="w-full h-full object-cover"
                                  />
                                );
                              }
                              return (
                                <span className="text-4xl font-black text-zinc-700">{actressName.charAt(0)}</span>
                              );
                            })()}
                          </div>`;

const search = `<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] shrink-0 bg-zinc-900 flex items-center justify-center">\n                            <span className="text-4xl font-black text-zinc-700">{selectedCategory.replace('Actress: ', '').charAt(0)}</span>\n                          </div>`;

if(code.includes(search)) {
  code = code.replace(search, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched correctly");
} else {
  console.log("Not found, trying flexible search");
  // using regex for more flexible whitespace matching
  const regex = /<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-\[0_0_30px_rgba\(239,68,68,0\.3\)\] shrink-0 bg-zinc-900 flex items-center justify-center">[\s\S]*?<span className="text-4xl font-black text-zinc-700">\{selectedCategory\.replace\('Actress: ', ''\)\.charAt\(0\)\}<\/span>[\s\S]*?<\/div>/;
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched using flexible search");
}
