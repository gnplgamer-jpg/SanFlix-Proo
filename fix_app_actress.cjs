const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
const importMovieRail = "import { MovieRail } from './components/MovieRail';";
const importActressRail = "import { ActressRail } from './components/ActressRail';";
code = code.replace(importMovieRail, importMovieRail + "\n" + importActressRail);

// Add filtering logic
const filterSanflixPro = `       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);`;
const filterActress = `       } else if (selectedCategory === 'SanFlix-Pro') {
          result = result.filter(m => m.is_sanflix_pro);
       } else if (selectedCategory.startsWith('Actress: ')) {
          const actressName = safeLower(selectedCategory.replace('Actress: ', '').trim());
          result = result.filter(m => safeLower(m.cast_crew).includes(actressName) || safeLower(m.title).includes(actressName));`;
code = code.replace(filterSanflixPro, filterActress);

// Add the rail rendering
const sanflixProRail = `                  {/* SanFlix-Pro Network Channel */}`;
const actressRailToRender = `                  {/* Actresses Rail */}
                  <ActressRail onSelectActress={(name) => setSelectedCategory('Actress: ' + name)} />
                  
                  {/* SanFlix-Pro Network Channel */}`;
code = code.replace(sanflixProRail, actressRailToRender);

// Render the title properly in the SelectedCategory view
const titleLogic = `{selectedCategory === 'All' ? 'All Content' : selectedCategory} ({searchResults.length})`;
const newTitleLogic = `{selectedCategory === 'All' ? 'All Content' : selectedCategory.startsWith('Actress: ') ? selectedCategory.replace('Actress: ', '') + ' Movies' : selectedCategory} ({searchResults.length})`;
code = code.replace(titleLogic, newTitleLogic);

fs.writeFileSync('src/App.tsx', code);
