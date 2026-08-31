const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const anchor = `  const oldIsGoldMovies = useMemo(() =>`;
const beforeAnchor = code.substring(0, code.indexOf(anchor));
let afterAnchor = code.substring(code.indexOf(anchor));

afterAnchor = afterAnchor.replace(/filteredContent\.filter/g, 'standardContent.filter');
// Also replace `[filteredContent]` with `[standardContent]` in the afterAnchor part, but only for the lines that were using standardContent.
// Actually, it's fine if they depend on `filteredContent`, but they use `standardContent`, so we should probably fix the dependency array too.
afterAnchor = afterAnchor.replace(/\[filteredContent\]/g, '[standardContent]');

code = beforeAnchor + afterAnchor;
fs.writeFileSync('src/App.tsx', code);
