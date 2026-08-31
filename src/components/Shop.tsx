import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ExternalLink, Star, Search, X, ShoppingCart } from 'lucide-react';
import { db, collection, getDocs, onSnapshot } from '../firebase';

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  affiliateUrl: string;
  category?: string;
  price?: string;
  rating?: string;
  description?: string;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const categories = ['All', 'General', 'Gaming', 'Electronics', 'Fashion', 'Accessories', '18+'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 overflow-y-auto pb-32">
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-red-500" />
          Daraz Affiliate Shop
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/5 overflow-x-auto hide-scrollbar whitespace-nowrap bg-zinc-950 sticky top-[72px] z-30">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
            <p>No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
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
            ))}
          </div>
        )}
      </div>

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
      </AnimatePresence>
    </div>
  );
}
