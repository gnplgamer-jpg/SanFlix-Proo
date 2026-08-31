const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { Globe, Settings, X, Sparkles, Bot } from 'lucide-react';",
  "import { Globe, Settings, X, Sparkles, Bot, ExternalLink } from 'lucide-react';"
);

// Add state for promo
const stateAnchor = "const [searchQuery, setSearchQuery] = useState('');";
const stateNew = `const [searchQuery, setSearchQuery] = useState('');
  const [promoProduct, setPromoProduct] = useState<any>(null);
  const [showPromo, setShowPromo] = useState(false);
  
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: any[] = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        if (productsList.length > 0 && !sessionStorage.getItem('promo_shown')) {
          sessionStorage.setItem('promo_shown', 'true');
          const randomProduct = productsList[Math.floor(Math.random() * productsList.length)];
          setPromoProduct(randomProduct);
          setShowPromo(true);
          
          setTimeout(() => {
            setShowPromo(false);
          }, 5000);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    setTimeout(() => {
      fetchPromo();
    }, 1500);
  }, []);`;

code = code.replace(stateAnchor, stateNew);

const jsxAnchor = "<div className=\"max-w-md mx-auto bg-zinc-950 min-h-screen relative shadow-2xl shadow-black border-x border-zinc-900/50 overflow-hidden pb-24\">";
const jsxNew = `<AnimatePresence>
        {showPromo && promoProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div 
              className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.3)] max-w-sm w-full cursor-pointer relative group"
              onClick={() => {
                 window.open(promoProduct.affiliateUrl, '_blank', 'noopener,noreferrer');
                 setShowPromo(false);
              }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPromo(false); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-zinc-300 hover:text-white z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative aspect-square">
                <img src={promoProduct.imageUrl || 'https://via.placeholder.com/400'} alt={promoProduct.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">Special Offer</div>
              </div>
              <div className="p-4 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">{promoProduct.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-400">Sponsored</span>
                  <span className="text-sm font-bold text-red-500 flex items-center gap-1">Shop Now <ExternalLink className="w-3 h-3" /></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-md mx-auto bg-zinc-950 min-h-screen relative shadow-2xl shadow-black border-x border-zinc-900/50 overflow-hidden pb-24">`;

code = code.replace(jsxAnchor, jsxNew);

// Fix TopHeader onCartClick mapping in App.tsx
code = code.replace(
  "              onSearchSubmit={handleSearchCommit}\n            />",
  "              onSearchSubmit={handleSearchCommit}\n              onCartClick={() => setActiveTab('cart')}\n            />"
);

fs.writeFileSync('src/App.tsx', code);
