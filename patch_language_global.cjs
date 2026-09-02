const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Patch filteredContent
const anchor = "cats = Array.from(new Set(cats.filter(Boolean)));\n      return { ...m, mapped_category_rail: cats.join(', ') };\n    });\n  }, [isAdultEnabled, moviesList]);";

const newFiltered = `cats = Array.from(new Set(cats.filter(Boolean)));
      return { ...m, mapped_category_rail: cats.join(', ') };
    });

    if (selectedLanguage && selectedLanguage !== 'All Languages') {
       const lang = selectedLanguage.toLowerCase();
       list = list.filter(m => {
         const inLang = safeLower(m.language).includes(lang);
         const inUrls = Array.isArray(m.language_urls) && m.language_urls.some((l) => safeLower(l.language).includes(lang));
         const inCat = safeLower(m.mapped_category_rail).includes(lang);
         return inLang || inUrls || inCat;
       });
    }

    return list;
  }, [isAdultEnabled, isPHubEnabled, moviesList, selectedLanguage]);`;

code = code.replace(anchor, newFiltered);

// Remove filter from standardContent
const standardRegex = /const standardContent = useMemo\(\(\) => \{[\s\S]*?\}, \[filteredContent, selectedLanguage\]\);/;
const newStandard = `const standardContent = useMemo(() => {
    return filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
  }, [filteredContent]);`;
code = code.replace(standardRegex, newStandard);

// Remove filter from searchResults
const searchResultsRegex = /if \(selectedLanguage && selectedLanguage !== 'All Languages'\) \{[\s\S]*?inLang \|\| inCat \|\| inTitle \|\| inUrls;\s*\}\);\s*\}/;
code = code.replace(searchResultsRegex, '');

// Fix dependencies in searchResults
const searchDepsRegex = /\}, \[searchQuery, filteredContent, selectedCategory, selectedLanguage\]\);/;
const newSearchDeps = `}, [searchQuery, filteredContent, selectedCategory]);`;
code = code.replace(searchDepsRegex, newSearchDeps);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched language filter globally');
