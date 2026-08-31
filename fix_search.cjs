const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `  const searchResults = useMemo(() => {
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

const replaceStr = `  const searchResults = useMemo(() => {
    let result = filteredContent;
    
    if (selectedCategory && selectedCategory !== '' && selectedCategory !== 'All' && selectedCategory !== 'Recent') {
       if (selectedCategory === '🔥 18+ Hub') {
          result = result.filter(m => m.ad_gate);
       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);
       } else {
          // Normal category, so we exclude 18+ and sanflix pro
          result = standardContent;
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
       // 'All', 'Recent', or no category, but searching
       // If no search query, should we show everything or exclude adult/pro?
       // Let's keep filteredContent if it's just home page search, or maybe exclude adult/pro unless explicitly searched?
       // Users probably want to search everything.
    }
    
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(
        (m) => safeLower(m.title).includes(queryStr) || safeLower(m.mapped_category_rail).includes(queryStr)
      );
    }
    
    return result;
  }, [searchQuery, filteredContent, selectedCategory, standardContent]);`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
