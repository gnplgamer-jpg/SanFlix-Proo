const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add unlockingMovie to stateRefs
code = code.replace(
  'globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab',
  'globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab, unlockingMovie'
);
code = code.replace(
  'globalVideo, showAuthModal, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab',
  'globalVideo, showAuthModal, showPremiumModal, isAdPlaying, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab, unlockingMovie'
);

// 2. Add handling in handleBackButton
code = code.replace(
  '      if (state.showPremiumModal) {',
  '      if (state.unlockingMovie) {\n        setUnlockingMovie(null);\n        return;\n      }\n      if (state.showPremiumModal) {'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched back button');
