const fs = require('fs');
let code = fs.readFileSync('src/components/Shop.tsx', 'utf-8');

const targetStr = `            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProduct(product)}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col shadow-lg cursor-pointer group"
              >
                <div className="relative aspect-square bg-zinc-800">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/400'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 border border-white/10 text-zinc-300 group-hover:text-red-500 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">{product.title}</h3>
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-[10px] text-zinc-400">{product.rating}</span>
                      </div>
                    )}
                    {product.price && (
                      <p className="text-xs font-bold text-red-400 mb-2">{product.price}</p>
                    )}
                  </div>
                  <button className="w-full py-1.5 mt-auto rounded-lg bg-red-600/10 text-red-500 text-xs font-bold border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    Buy on Daraz
                  </button>
                </div>
              </motion.div>
            ))}`;

const newStr = `            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProduct(product)}
                className="bg-zinc-900/40 rounded-2xl overflow-hidden border border-white/5 flex flex-col cursor-pointer group hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
              >
                <div className="relative aspect-square bg-zinc-950/50 p-2 sm:p-3 overflow-hidden">
                  <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/20">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/400'} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/10 text-zinc-300 group-hover:text-white shadow-lg translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-3">
                    <h3 className="text-[13px] sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug mb-2 group-hover:text-white transition-colors">{product.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      {product.price ? (
                        <p className="text-sm font-bold text-red-400">{product.price}</p>
                      ) : (
                        <p className="text-xs font-medium text-zinc-500">Check Price</p>
                      )}
                      {product.rating && (
                        <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-md border border-white/5">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-[11px] font-medium text-zinc-300">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="w-full py-2 mt-auto rounded-xl bg-white/5 text-zinc-300 text-xs font-bold border border-white/5 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-1.5">
                    View Product
                  </button>
                </div>
              </motion.div>
            ))}`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/Shop.tsx', code);
