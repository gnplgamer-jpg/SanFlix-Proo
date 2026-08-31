const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importTarget = `import { ReportModal } from './components/ReportModal';`;
const importReplace = `import { ReportModal } from './components/ReportModal';\nimport { NoticeModal } from './components/NoticeModal';`;
code = code.replace(importTarget, importReplace);

const renderTarget = `      <ReportModal
        isOpen={!!reportingData?.isOpen}`;
const renderReplace = `      <NoticeModal />
      <ReportModal
        isOpen={!!reportingData?.isOpen}`;
code = code.replace(renderTarget, renderReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Added NoticeModal to App.tsx");
