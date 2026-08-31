const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const targetStr = `                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">{adProduct.title}</h4>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>`;

const newStr = `                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">{adProduct.title}</h4>
                      {adProduct.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-[10px] text-zinc-400">{adProduct.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        {adProduct.price && <span className="text-xs font-bold text-red-400">{adProduct.price}</span>}
                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/PlayerModal.tsx', code);
