const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "  } | null>(null);",
  "  } | null>(null);\n  const [reportingData, setReportingData] = useState<{ isOpen: boolean, movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number } | null>(null);"
);

fs.writeFileSync('src/App.tsx', code);
