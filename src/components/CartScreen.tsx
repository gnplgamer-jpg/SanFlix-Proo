import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ExternalLink, History, Heart } from 'lucide-react';
import { db, collection, getDocs } from '../firebase';

export function CartScreen() {
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    // For now we just load standard products as "History" as a mockup since real history wasn't strictly logged previously
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: any[] = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        setHistory(productsList.slice(0, 4)); // Show first few as history
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  const openLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 overflow-y-auto pb-32">
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          Wishlist & History
        </h1>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Recently Viewed Affiliate Products</h2>
        </div>
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-center px-8">Your wishlist is empty. Explore our Shop to find great products!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((product) => (
              <motion.div
                key={product.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openLink(product.affiliateUrl)}
                className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 flex items-center gap-4 shadow-lg cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">{product.title}</h3>
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                    Buy on Daraz <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
