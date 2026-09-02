const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStandard = `  const standardContent = useMemo(() => {
    return filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
  }, [filteredContent]);`;

const newStandard = `  const standardContent = useMemo(() => {
    let result = filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
    if (selectedLanguage && selectedLanguage !== 'All Languages') {
       const lang = selectedLanguage.toLowerCase();
       result = result.filter(m => {
         const inLang = safeLower(m.language).includes(lang);
         const inUrls = Array.isArray(m.language_urls) && m.language_urls.some((l) => safeLower(l.language).includes(lang));
         return inLang || inUrls;
       });
    }
    return result;
  }, [filteredContent, selectedLanguage]);`;

code = code.replace(oldStandard, newStandard);
fs.writeFileSync('src/App.tsx', code);
console.log('Language filter patched in standardContent');
