const fs = require('fs');
let code = fs.readFileSync('src/components/Shop.tsx', 'utf-8');

// Update Interface
code = code.replace(
  "  rating?: string;",
  "  rating?: string;\n  description?: string;"
);

// Update Categories
code = code.replace(
  "  const categories = ['All', 'General', 'Gaming', 'Electronics', 'Fashion', 'Accessories'];",
  "  const categories = ['All', 'General', 'Gaming', 'Electronics', 'Fashion', 'Accessories', '18+'];"
);

// Add imports for AnimatePresence, X (close icon), ShoppingCart
code = code.replace(
  "import { motion } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';"
);
code = code.replace(
  "import { ShoppingBag, ExternalLink, Star, Search } from 'lucide-react';",
  "import { ShoppingBag, ExternalLink, Star, Search, X, ShoppingCart } from 'lucide-react';"
);

// Add selectedProduct state
code = code.replace(
  "  const [searchTerm, setSearchTerm] = useState('');",
  "  const [searchTerm, setSearchTerm] = useState('');\n  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);"
);

// Update product click handler
code = code.replace(
  "onClick={() => openLink(product.affiliateUrl)}",
  "onClick={() => setSelectedProduct(product)}"
);

// Add Product Modal UI right before the final </div>
const modalUI = `
      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-zinc-950 sm:rounded-2xl rounded-t-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Image Section */}
              <div className="relative w-full aspect-square sm:aspect-video bg-zinc-900 shrink-0">
                <img 
                  src={selectedProduct.imageUrl || 'https://via.placeholder.com/600'} 
                  alt={selectedProduct.title} 
                  className="w-full h-full object-contain p-4"
                />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                {selectedProduct.category && (
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    {selectedProduct.category}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-6 flex-1 overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
                  {selectedProduct.title}
                </h2>
                
                <div className="flex items-center justify-between mb-6">
                  {selectedProduct.price ? (
                    <span className="text-2xl font-black text-red-500">{selectedProduct.price}</span>
                  ) : (
                    <span className="text-sm font-medium text-zinc-500">Price unavailable</span>
                  )}
                  
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold text-yellow-500">{selectedProduct.rating}</span>
                    </div>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-zinc-400">Description</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md shrink-0">
                <button 
                  onClick={() => openLink(selectedProduct.affiliateUrl)}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buy Now on Daraz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(
  "    </div>\n  );\n}",
  modalUI + "\n    </div>\n  );\n}"
);

fs.writeFileSync('src/components/Shop.tsx', code);
