const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetFilter = `  const filteredContent = useMemo(() => {
    let list = moviesList;
    if (isPHubEnabled && isAdultEnabled) {
      // In Porn Hub mode, only show Porn Hub labeled content OR 18+ content (optional depending on how strict you want it)
      list = list.filter(m => (m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub')) || (m.ad_gate && m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub')));
    } else {
      // Normal mode
      list = isAdultEnabled ? list.filter(m => !m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub')) : list.filter(m => !m.ad_gate && (!m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub')));
    }`;

const newFilter = `  const filteredContent = useMemo(() => {
    let list = moviesList;

    if (!isPHubEnabled) {
      list = list.filter(m => !m.mapped_category_rail || !m.mapped_category_rail.includes('Porn Hub'));
    }

    if (!isAdultEnabled) {
      list = list.filter(m => {
        const isPhub = m.mapped_category_rail && m.mapped_category_rail.includes('Porn Hub');
        if (isPhub && isPHubEnabled) return true;
        return !m.ad_gate;
      });
    }`;

code = code.replace(targetFilter, newFilter);

const targetCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set<string>();
    filteredContent.forEach(m => {
      const cats = String(m.mapped_category_rail || '').split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach(c => dynamicCats.add(c));
    });
    const all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    if (isPHubEnabled && isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && (c.includes('Porn Hub') || c === 'All' || c === 'Recent'));
    }
    
    if (!isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS') && !c.includes('Porn Hub'));
    }
    
    return all.filter(c => typeof c === 'string' && !c.includes('Porn Hub'));
  }, [filteredContent, isAdultEnabled, isPHubEnabled]);`;

const newCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set<string>();
    filteredContent.forEach(m => {
      const cats = String(m.mapped_category_rail || '').split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach(c => dynamicCats.add(c));
    });
    const all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    let result = all;
    
    if (!isPHubEnabled) {
      result = result.filter(c => typeof c === 'string' && !c.includes('Porn Hub'));
    }
    
    if (!isAdultEnabled) {
      result = result.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS'));
    }
    
    return result;
  }, [filteredContent, isAdultEnabled, isPHubEnabled]);`;

code = code.replace(targetCategories, newCategories);

fs.writeFileSync('src/App.tsx', code);
