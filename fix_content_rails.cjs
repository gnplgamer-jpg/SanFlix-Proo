const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert standardContent before oldIsGoldMovies
const standardContentStr = `  const standardContent = useMemo(() => {
    return filteredContent.filter(m => !m.is_sanflix_pro && !m.ad_gate && !(m.mapped_category_rail && String(m.mapped_category_rail).includes('Porn Hub')));
  }, [filteredContent]);

  const oldIsGoldMovies =`;

code = code.replace("  const oldIsGoldMovies =", standardContentStr);

// Replace filteredContent with standardContent for normal rails
const railsToReplace = [
  'oldIsGoldMovies', 'actionMovies', 'horrorMovies', 'crimeMovies', 'romanticMovies', 
  'comedyMovies', 'dramaMovies', 'adventureMovies', 'bhojpuriMovies', 'sadContent', 
  'wweContent', 'warContent', 'tvShowsHub', 'serialsNetwork', 'indianTvSerials', 
  'animeContent', 'sciFiMovies', 'animationShows', 'netflixContent', 'primeContent', 
  'altBalajiContent', 'sonyLivContent', 'mxPlayerContent', 'popularMovies', 'topGlobalMovies'
];

railsToReplace.forEach(rail => {
  const regex = new RegExp(`const ${rail} = useMemo\\(\\(\\) => (.*?)(filteredContent)(.*?)\\], \\[filteredContent\\]\\);`, 'g');
  code = code.replace(regex, `const ${rail} = useMemo(() => $1standardContent$3], [standardContent]);`);
});

fs.writeFileSync('src/App.tsx', code);
