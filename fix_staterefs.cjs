const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `stateRefs.current = {
      globalVideo, showAuthModal, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab
    };`;

const replacement = `stateRefs.current = {
      globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab
    };`;

code = code.replace(anchor, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed stateRefs missing properties');
