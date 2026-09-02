const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add selectedLanguage to searchResults deps and logic
const searchResultsDepsOld = `}, [searchQuery, filteredContent, selectedCategory]);`;
const searchResultsDepsNew = `
    if (selectedLanguage) {
       const lang = selectedLanguage.toLowerCase();
       result = result.filter(m => safeLower(m.language).includes(lang) || safeLower(m.mapped_category_rail).includes(lang) || safeLower(m.title).includes(lang));
    }
    return result;
  }, [searchQuery, filteredContent, selectedCategory, selectedLanguage]);`;

code = code.replace(`return result;\n  }, [searchQuery, filteredContent, selectedCategory]);`, searchResultsDepsNew);

// 2. Add the language dropdown UI before category chips
const categoryChipsOld = `{/* Category Chips Scroll */}`;
const categoryChipsNew = `{/* Language Dropdown & Category Chips */}
                  <div className="flex items-center gap-3 px-4 mb-2">
                    <div className="relative shrink-0">
                       <select 
                         value={selectedLanguage} 
                         onChange={(e) => setSelectedLanguage(e.target.value)}
                         className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-full pl-3 pr-8 py-1.5 outline-none focus:border-red-500 appearance-none font-medium cursor-pointer"
                       >
                         <option value="">All Languages</option>
                         <option value="Hindi">Hindi</option>
                         <option value="English">English</option>
                         <option value="Bhojpuri">Bhojpuri</option>
                         <option value="Tamil">Tamil</option>
                         <option value="Telugu">Telugu</option>
                         <option value="Regional">Regional</option>
                       </select>
                       <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* Category Chips Scroll */}`;

code = code.replace(categoryChipsOld, categoryChipsNew);

fs.writeFileSync('src/App.tsx', code);
console.log('patched');
