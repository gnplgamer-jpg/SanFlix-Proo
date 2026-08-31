const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importTarget = `import { NoticeModal } from './components/NoticeModal';`;
const importReplace = `import { NoticeModal } from './components/NoticeModal';\nimport { RequestModal } from './components/RequestModal';`;
code = code.replace(importTarget, importReplace);

const stateTarget = `  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);`;
const stateReplace = `  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);\n  const [isRequestOpen, setIsRequestOpen] = useState(false);`;
code = code.replace(stateTarget, stateReplace);

const headerTarget = `        <TopHeader 
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onResumeLatest={resumeLatest}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
          onCartClick={() => setScreen('cart')}
          onSearchFocus={setIsSearchFocused}
        />`;
const headerReplace = `        <TopHeader 
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onResumeLatest={resumeLatest}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
          onCartClick={() => setScreen('cart')}
          onSearchFocus={setIsSearchFocused}
          onRequestClick={() => setIsRequestOpen(true)}
        />`;
code = code.replace(headerTarget, headerReplace);

const modalTarget = `      <NoticeModal />`;
const modalReplace = `      <NoticeModal />\n      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />`;
code = code.replace(modalTarget, modalReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");
