const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

code = code.replace(
  "  const [fetchedCrew, setFetchedCrew] = useState<any[]>([]);",
  "  const [fetchedCrew, setFetchedCrew] = useState<any[]>([]);\n  const [reportingData, setReportingData] = useState<{ isOpen: boolean, episodeTitle?: string, episodeIdx?: number, failedUrl: string } | null>(null);"
);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
