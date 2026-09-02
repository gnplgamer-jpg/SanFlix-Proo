const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('import { App as CapApp } from "@capacitor/app";')) {
  app = app.replace('import { Capacitor } from "@capacitor/core";', 'import { Capacitor } from "@capacitor/core";\nimport { App as CapApp } from "@capacitor/app";');
}

// Now we need to inject the back logic in the main App function.
// Let's find where to put the refs.
// We can find `const [globalVideo, setGlobalVideo] = useState<{`
// and insert the refs right before useEffects.

// Wait, the safest way is to add a massive useEffect that depends on these state variables, 
// and re-registers the listener, but CapApp.addListener returns a promise that resolves to an object with `remove()` in Capacitor v3+, or PluginListenerHandle.

// Let's create a custom hook or just a useEffect near the top of the App component.
// We will insert it after `const [appError, setAppError] = useState<Error | null>(null);`

const backLogic = `
  // --- LAYERED BACK NAVIGATION LOGIC ---
  const stateRefs = useRef({
    globalVideo, showAuthModal, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab
  });
  
  useEffect(() => {
    stateRefs.current = {
      globalVideo, showAuthModal, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab
    };
  }, [globalVideo, showAuthModal, showSpinnerPage, reportingData, isRequestOpen, isChatOpen, selectedMovie, selectedCategory, isSearchActive, activeTab]);

  useEffect(() => {
    let lastBackPress = 0;
    
    const handleBackButton = () => {
      const state = stateRefs.current;
      
      // Layer 1: Video Player
      if (state.globalVideo) {
        setGlobalVideo(null);
        return;
      }
      
      // Layer 2: Top level Modals
      if (state.showAuthModal) {
        setShowAuthModal(false);
        return;
      }
      if (state.showSpinnerPage) {
        setShowSpinnerPage(false);
        return;
      }
      if (state.reportingData) {
        setReportingData(null);
        return;
      }
      if (state.isRequestOpen) {
        setIsRequestOpen(false);
        return;
      }
      if (state.isChatOpen) {
        setIsChatOpen(false);
        return;
      }
      
      // Layer 3: Movie Details
      if (state.selectedMovie) {
        setSelectedMovie(null);
        return;
      }
      
      // Layer 4: Category View
      if (state.selectedCategory) {
        setSelectedCategory(null);
        return;
      }
      
      // Layer 5: Search
      if (state.isSearchActive) {
        setIsSearchActive(false);
        return;
      }
      
      // Layer 6: Tabs -> return to home
      if (state.activeTab !== 'home') {
        setActiveTab('home');
        return;
      }
      
      // Layer 7: Exit App logic (double tap)
      const now = Date.now();
      if (now - lastBackPress < 2000) {
        CapApp.exitApp();
      } else {
        lastBackPress = now;
        setToastMessage("Press back again to exit");
      }
    };
    
    CapApp.addListener('backButton', handleBackButton);
    
    // Also handle web browser back button
    const handleWebBack = (e: PopStateEvent) => {
      handleBackButton();
      // Push state back so we can trap it again
      window.history.pushState(null, '', window.location.href);
    };
    
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleWebBack);
    
    return () => {
      CapApp.removeAllListeners();
      window.removeEventListener('popstate', handleWebBack);
    };
  }, []);
  // ------------------------------------
`;

app = app.replace('const [appError, setAppError] = useState<Error | null>(null);', 'const [appError, setAppError] = useState<Error | null>(null);\n' + backLogic);

fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx patched with layered back logic');
