const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

const regex = /const categories = \['All', 'Favorites', 'Popular', 'Sports', 'Entertainment', 'Live TV', 'Hindi Movies', 'Bhojpuri', 'Nepali', 'News'\];/;
const replacement = `
  const dynamicCategories = Array.from(new Set(channels.map(c => c.category))).filter(Boolean).sort();
  // Keep core ones first, then alphabetical dynamic ones
  const coreCategories = ['All', 'Favorites', 'News', 'Movies', 'Sports', 'Entertainment', 'Music', 'Kids'];
  const otherCategories = dynamicCategories.filter(c => !coreCategories.includes(c));
  const categories = [...coreCategories, ...otherCategories];
`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
    console.log('Successfully updated categories logic');
} else {
    console.log('Could not find categories array to replace.');
}
