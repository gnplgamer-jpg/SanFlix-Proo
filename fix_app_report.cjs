const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { DirectVideoPlayer } from './components/DirectVideoPlayer';",
  "import { DirectVideoPlayer } from './components/DirectVideoPlayer';\nimport { ReportModal } from './components/ReportModal';"
);

// Add reportingData state
const globalVideoState = "const [globalVideo, setGlobalVideo] = useState<{ url: string, movie: any, showLanguageSelector: boolean, showQualitySelector: boolean, showEpisodeSelector: boolean, fallbackUrls: string[] } | null>(null);";
const reportingDataState = `  const [reportingData, setReportingData] = useState<{ isOpen: boolean, movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number } | null>(null);`;
code = code.replace(globalVideoState, globalVideoState + '\n' + reportingDataState);

// Replace reportBrokenLink with just opening the modal
const reportBrokenLinkFunc = `  const reportBrokenLink = async (movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number) => {
    try {
      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieId,
        movieTitle,
        episodeTitle: episodeTitle || '',
        episodeIdx: episodeIdx ?? null,
        failedUrl,
        timestamp: new Date().toISOString(),
        resolved: false
      });
      // Instead of alert which is blocked in iframe, we can dispatch a custom event or just console log
      console.log('Broken link reported to admin successfully.');
    } catch (err) {
      console.error('Failed to report', err);
    }
  };`;

const newReportBrokenLinkFunc = `  const reportBrokenLink = async (movieId: string, movieTitle: string, failedUrl: string, episodeTitle?: string, episodeIdx?: number) => {
    setReportingData({ isOpen: true, movieId, movieTitle, failedUrl, episodeTitle, episodeIdx });
  };`;

code = code.replace(reportBrokenLinkFunc, newReportBrokenLinkFunc);

// Render <ReportModal /> inside App.tsx (before the final closing div)
const finalDiv = `    </div>
  );
}`;
const newFinalDiv = `      <ReportModal
        isOpen={!!reportingData?.isOpen}
        onClose={() => setReportingData(null)}
        title={reportingData?.episodeTitle ? \`Report Episode: \${reportingData.episodeTitle}\` : 'Report Video Issue'}
        onSubmit={async (description) => {
          if (!reportingData) return;
          await addDoc(collection(db, 'SanFlix_Reports'), {
            movieId: reportingData.movieId,
            movieTitle: reportingData.movieTitle,
            episodeTitle: reportingData.episodeTitle || '',
            episodeIdx: reportingData.episodeIdx ?? null,
            failedUrl: reportingData.failedUrl,
            description,
            timestamp: new Date().toISOString(),
            resolved: false
          });
        }}
      />
    </div>
  );
}`;

code = code.replace(finalDiv, newFinalDiv);

fs.writeFileSync('src/App.tsx', code);
