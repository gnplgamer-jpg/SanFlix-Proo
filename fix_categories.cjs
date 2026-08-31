const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set<string>();
    filteredContent.forEach(m => {
      const cats = String(m.mapped_category_rail || '').split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach(c => dynamicCats.add(c));
    });
    const all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    if (!isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS'));
    }
    return all;
  }, [filteredContent, isAdultEnabled]);`;

const newCategories = `  const categoriesList = useMemo(() => {
    const dynamicCats = new Set<string>();
    filteredContent.forEach(m => {
      const cats = String(m.mapped_category_rail || '').split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach(c => dynamicCats.add(c));
    });
    const all = Array.from(new Set([...defaultStaticCategories, ...Array.from(dynamicCats)]));
    
    if (isPHubEnabledState && isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && (c.includes('Porn Hub') || c === 'All' || c === 'Recent'));
    }
    
    if (!isAdultEnabled) {
      return all.filter(c => typeof c === 'string' && !c.includes('18+ Hub') && !c.includes('ULLU') && !c.includes('KOOKU') && !c.includes('PRIMESHOTS') && !c.includes('Porn Hub'));
    }
    
    return all.filter(c => typeof c === 'string' && !c.includes('Porn Hub'));
  }, [filteredContent, isAdultEnabled, isPHubEnabledState]);`;

code = code.replace(targetCategories, newCategories);
fs.writeFileSync('src/App.tsx', code);
