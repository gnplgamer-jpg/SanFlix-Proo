const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetSearch = `  const searchResults = useMemo(() => {
    let result = filteredContent;
    
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(
        (m) => safeLower(m.title).includes(queryStr) || safeLower(m.mapped_category_rail).includes(queryStr)
      );
    }
    
    if (selectedCategory && selectedCategory !== '' && selectedCategory !== 'All' && selectedCategory !== 'Recent') {
       if (selectedCategory === '🔥 18+ Hub') {
          result = result.filter(m => m.ad_gate);
       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);
       } else if (selectedCategory.startsWith('Actress: ')) {
          const actressName = safeLower(selectedCategory.replace('Actress: ', '').trim());
          result = result.filter(m => safeLower(m.cast_crew).includes(actressName) || safeLower(m.title).includes(actressName));
       } else {
          const catKeyword = safeLower(selectedCategory).replace(' vip', '');
          result = result.filter(m => 
             safeLower(m.mapped_category_rail) === safeLower(selectedCategory) ||
            safeLower(m.mapped_category_rail).includes(catKeyword) ||
            safeLower(m.title).includes(catKeyword) ||
            safeLower(m.synopsis).includes(catKeyword) ||
            safeLower(m.cast_crew).includes(catKeyword)
          );
       }
    }
    
    return result;
  }, [searchQuery, filteredContent, selectedCategory]);`;

const newSearch = `  const searchResults = useMemo(() => {
    let result = filteredContent;
    
    // First, filter by category
    if (selectedCategory && selectedCategory !== '' && selectedCategory !== 'All' && selectedCategory !== 'Recent') {
       if (selectedCategory === '🔥 18+ Hub') {
          result = result.filter(m => m.ad_gate);
       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);
       } else {
          const isAdultNetwork = ['ULLU VIP', 'KOOKU', 'PRIMESHOTS'].includes(selectedCategory);
          
          if (!isAdultNetwork) {
             // For standard categories, strictly EXCLUDE 18+ and SanFlix-Pro
             result = result.filter(m => !m.ad_gate && !m.is_sanflix_pro && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
          } else {
             // For Adult networks, EXCLUDE SanFlix-Pro
             result = result.filter(m => !m.is_sanflix_pro);
          }

          if (selectedCategory.startsWith('Actress: ')) {
            const actressName = safeLower(selectedCategory.replace('Actress: ', '').trim());
            result = result.filter(m => safeLower(m.cast_crew).includes(actressName) || safeLower(m.title).includes(actressName));
          } else {
            const catKeyword = safeLower(selectedCategory).replace(' vip', '');
            result = result.filter(m => 
               safeLower(m.mapped_category_rail) === safeLower(selectedCategory) ||
              safeLower(m.mapped_category_rail).includes(catKeyword) ||
              safeLower(m.title).includes(catKeyword) ||
              safeLower(m.synopsis).includes(catKeyword) ||
              safeLower(m.cast_crew).includes(catKeyword)
            );
          }
       }
    } else {
       // For 'All' or 'Recent' tab (home view), exclude special content so they don't pollute the generic grid.
       // Special content like SanFlix-Pro and 18+ have their own rails or categories.
       if (!searchQuery.trim()) {
           result = result.filter(m => !m.ad_gate && !m.is_sanflix_pro && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
       }
    }
    
    // Then filter by search query
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(
        (m) => safeLower(m.title).includes(queryStr) || safeLower(m.mapped_category_rail).includes(queryStr) || safeLower(m.cast_crew).includes(queryStr)
      );
    }
    
    return result;
  }, [searchQuery, filteredContent, selectedCategory]);`;

code = code.replace(targetSearch, newSearch);
fs.writeFileSync('src/App.tsx', code);
