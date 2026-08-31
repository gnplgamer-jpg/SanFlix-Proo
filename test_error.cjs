const fs = require('fs');
let code = fs.readFileSync('src/components/ReportModal.tsx', 'utf-8');
code = code.replace("setError('Failed to submit report. Please try again.');", "console.error('Submit report error:', err); setError('Failed to submit report. Please try again.');");
fs.writeFileSync('src/components/ReportModal.tsx', code);
