const fs = require('fs');
let code = fs.readFileSync('src/components/Shop.tsx', 'utf-8');

// Update Interface
code = code.replace(
  "  category?: string;",
  "  category?: string;\n  price?: string;\n  rating?: string;"
);

// Add Search state
code = code.replace(
  "  const [selectedCategory, setSelectedCategory] = useState<string>('All');",
  "  const [selectedCategory, setSelectedCategory] = useState<string>('All');\n  const [searchTerm, setSearchTerm] = useState('');"
);

// Update Icon Import
code = code.replace(
  "import { ShoppingBag, ExternalLink, Star } from 'lucide-react';",
  "import { ShoppingBag, ExternalLink, Star, Search } from 'lucide-react';"
);

// Update filteredProducts to include search
const filterTarget = `  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'General') === selectedCategory);`;

const filterReplace = `  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });`;
code = code.replace(filterTarget, filterReplace);

// Add search bar UI
const uiTarget = `      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-red-500" />
          Daraz Affiliate Shop
        </h1>
      </div>`;

const uiReplace = `      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-4 flex flex-col gap-4">
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
      </div>`;
code = code.replace(uiTarget, uiReplace);

// Update Product Card to show Rating and Price
const cardTarget = `                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-2">{product.title}</h3>
                  <button className="w-full py-1.5 rounded-lg bg-red-600/10 text-red-500 text-xs font-bold border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    Buy on Daraz
                  </button>
                </div>`;

const cardReplace = `                <div className="p-3 flex-1 flex flex-col justify-between">
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
                </div>`;
code = code.replace(cardTarget, cardReplace);

fs.writeFileSync('src/components/Shop.tsx', code);
