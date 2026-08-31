const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const appSubmitRegex = /onSubmit={async \(description\) => \{[\s\S]*?await addDoc\(collection\(db, 'SanFlix_Reports'\), \{[\s\S]*?\}\);\s*\}\}/;
const newAppSubmit = `onSubmit={async (description) => {
          if (!reportingData) return;
          const payload = {
            movieId: reportingData.movieId || '',
            movieTitle: reportingData.movieTitle || '',
            episodeTitle: reportingData.episodeTitle || '',
            episodeIdx: reportingData.episodeIdx !== undefined ? reportingData.episodeIdx : null,
            failedUrl: reportingData.failedUrl || '',
            description: description || '',
            timestamp: new Date().toISOString(),
            resolved: false
          };
          // Remove any accidental undefined
          Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
          await addDoc(collection(db, 'SanFlix_Reports'), payload);
        }}`;
appCode = appCode.replace(appSubmitRegex, newAppSubmit);
fs.writeFileSync('src/App.tsx', appCode);

let playerCode = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');
const playerSubmitRegex = /onSubmit={async \(description\) => \{[\s\S]*?await addDoc\(collection\(db, 'SanFlix_Reports'\), \{[\s\S]*?\}\);\s*\}\}/;
const newPlayerSubmit = `onSubmit={async (description) => {
          if (!reportingData) return;
          const payload = {
            movieId: movie?.firebase_id || movie?.id || 'unknown',
            movieTitle: movie?.title || 'Unknown',
            episodeTitle: reportingData.episodeTitle || '',
            episodeIdx: reportingData.episodeIdx !== undefined ? reportingData.episodeIdx : null,
            failedUrl: reportingData.failedUrl || '',
            description: description || '',
            timestamp: new Date().toISOString(),
            resolved: false
          };
          Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
          await addDoc(collection(db, 'SanFlix_Reports'), payload);
        }}`;
playerCode = playerCode.replace(playerSubmitRegex, newPlayerSubmit);
fs.writeFileSync('src/components/PlayerModal.tsx', playerCode);

