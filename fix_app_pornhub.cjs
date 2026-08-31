const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetState = `  // Profile settings state
  const [isAdultEnabled, setIsAdultEnabled] = useState(() => {`;

const newState = `  // Profile settings state
  const [isPHubEnabled, setIsPHubEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('SANFLIX_PHUB_ENABLED');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isAdultEnabled, setIsAdultEnabled] = useState(() => {`;

code = code.replace(targetState, newState);

const targetFilter = `  // Filter content based on adult content setting
  const filteredContent = useMemo(() => {
    let list = isAdultEnabled ? moviesList : moviesList.filter(m => !m.ad_gate);`;

const newFilter = `  // Filter content based on adult content setting
  const filteredContent = useMemo(() => {
    let list = moviesList;
    if (isPHubEnabled && isAdultEnabled) {
      // In Porn Hub mode, only show Porn Hub labeled content OR 18+ content (optional depending on how strict you want it)
      list = list.filter(m => (m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub')) || (m.ad_gate && m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub')));
    } else {
      // Normal mode
      list = isAdultEnabled ? list.filter(m => !m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub')) : list.filter(m => !m.ad_gate && (!m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub')));
    }
`;
code = code.replace(targetFilter, newFilter);

const targetCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set();
    filteredContent.forEach(m => {
      if (m.categories) m.categories.forEach((c: any) => dynamicCats.add(c));
      if (m.mapped_category_rail) {
        String(m.mapped_category_rail).split(/[,\\/|]+/).forEach(c => {
          if (c.trim()) dynamicCats.add(c.trim());
        });
      }
    });

    const all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    if (!isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS'));
    }
    return all;
  }, [filteredContent, isAdultEnabled]);`;

const newCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set();
    filteredContent.forEach(m => {
      if (m.categories) m.categories.forEach((c: any) => dynamicCats.add(c));
      if (m.mapped_category_rail) {
        String(m.mapped_category_rail).split(/[,\\/|]+/).forEach(c => {
          if (c.trim()) dynamicCats.add(c.trim());
        });
      }
    });

    let all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    if (isPHubEnabled && isAdultEnabled) {
       return all.filter(c => typeof c === 'string' && c.includes('Porn Hub'));
    }

    if (!isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS') && !c.includes('Porn Hub'));
    }
    
    return all.filter(c => typeof c === 'string' && !c.includes('Porn Hub'));
  }, [filteredContent, isAdultEnabled, isPHubEnabled]);`;

code = code.replace(targetCategories, newCategories);

// Also change theme slightly if phub mode
const targetTheme = `export default function App() {`;
const newTheme = `export default function App() {
  const [isPHubEnabledState, setIsPHubEnabledState] = useState(false);
  useEffect(() => {
     setIsPHubEnabledState(localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true');
  }, []);
`;
code = code.replace(targetTheme, newTheme);


const targetClass = `className="pb-20 bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-red-500/30"`;
const newClass = `className={\`pb-20 \${isPHubEnabledState ? 'bg-[#0f0f0f]' : 'bg-black'} min-h-screen text-white font-sans overflow-x-hidden selection:bg-red-500/30\`}`;
code = code.replace(targetClass, newClass);

const targetNav = `<div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent pt-safe transition-all duration-300">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col relative group"
            onClick={() => setActiveTab('home')}
          >
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E50914] to-[#ff4b55] flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] transition-all">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                SanFlix<span className="text-[#E50914]">-Pro</span>
              </h1>
            </div>
            <div className="absolute -bottom-3 left-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-[#E50914] tracking-widest uppercase">Premium</span>
            </div>
          </motion.div>`;
          
const newNav = `<div className={\`fixed top-0 left-0 right-0 z-40 bg-gradient-to-b \${isPHubEnabledState ? 'from-[#0f0f0f]/90 via-[#0f0f0f]/60' : 'from-black/90 via-black/60'} to-transparent pt-safe transition-all duration-300\`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col relative group cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            {isPHubEnabledState ? (
              <div className="flex items-center gap-1">
                 <span className="text-xl sm:text-2xl font-black text-white">San</span>
                 <span className="text-xl sm:text-2xl font-black text-black bg-orange-500 px-2 py-0.5 rounded-sm">Hub</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E50914] to-[#ff4b55] flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] transition-all">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                  SanFlix<span className="text-[#E50914]">-Pro</span>
                </h1>
              </div>
            )}
          </motion.div>`;

code = code.replace(targetNav, newNav);

fs.writeFileSync('src/App.tsx', code);
