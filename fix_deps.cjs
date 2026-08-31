const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `  }, [continueWatchingIds, standardContent]);`,
  `  }, [continueWatchingIds, filteredContent]);`
);
code = code.replace(
  `  }, [myListIds, standardContent]);`,
  `  }, [myListIds, filteredContent]);`
);

fs.writeFileSync('src/App.tsx', code);
