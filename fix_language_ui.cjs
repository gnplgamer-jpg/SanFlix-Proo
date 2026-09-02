const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update Filter Logic
const searchResultsDepsNew = `
    if (selectedLanguage && selectedLanguage !== 'All Languages') {
       const lang = selectedLanguage.toLowerCase();
       result = result.filter(m => {
         const inLang = safeLower(m.language).includes(lang);
         const inCat = safeLower(m.mapped_category_rail).includes(lang);
         const inTitle = safeLower(m.title).includes(lang);
         const inUrls = Array.isArray(m.language_urls) && m.language_urls.some((l) => safeLower(l.language).includes(lang));
         return inLang || inCat || inTitle || inUrls;
       });
    }
    return result;
  }, [searchQuery, filteredContent, selectedCategory, selectedLanguage]);`;

code = code.replace(/if \(selectedLanguage\) \{[\s\S]*?\}, \[searchQuery, filteredContent, selectedCategory, selectedLanguage\]\);/m, searchResultsDepsNew);


// Upgrade UI
const categoryChipsOldRegex = /\{\/\* Language Dropdown & Category Chips \*\/\}[\s\S]*?\{\/\* Category Chips Scroll \*\/\}/m;
const stylishLangUI = `{/* Stylish Language & Category Filters */}
                  <div className="px-4 mb-4 flex flex-col gap-3">
                    {/* Language Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest shrink-0 mr-1">Language:</span>
                      {['All Languages', 'Hindi', 'English', 'Bhojpuri', 'Tamil', 'Telugu'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang === 'All Languages' ? '' : lang)}
                          className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 \${
                            (selectedLanguage === lang || (!selectedLanguage && lang === 'All Languages'))
                              ? 'bg-red-600 text-white border-red-500 shadow-[0_2px_10px_rgba(220,38,38,0.3)]'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                          }\`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Category Chips Scroll */}`;

code = code.replace(categoryChipsOldRegex, stylishLangUI);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Language UI & Logic');
