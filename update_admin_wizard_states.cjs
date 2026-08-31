const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const stateTarget = `  const [trendingTMDB, setTrendingTMDB] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);`;

const stateReplace = `  const [trendingTMDB, setTrendingTMDB] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [wizardQueue, setWizardQueue] = useState<any[]>([]);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [flashPopupItem, setFlashPopupItem] = useState<any>(null);
  const [flashCountdown, setFlashCountdown] = useState(5);
  const [flashDismissed, setFlashDismissed] = useState(false);`;

code = code.replace(stateTarget, stateReplace);

const effectTarget = `  useEffect(() => {
     if (adminTab === 'tmdb' && trendingTMDB.length === 0) {
        setTrendingLoading(true);
        fetch('/api/meta-data/trending-tmdb')
          .then(res => res.json())
          .then(data => {
             if (data.results) {
               setTrendingTMDB(data.results);
             }
             setTrendingLoading(false);
          })
          .catch(() => setTrendingLoading(false));
     }
  }, [adminTab]);`;

const effectReplace = `  useEffect(() => {
     if (trendingTMDB.length === 0) {
        setTrendingLoading(true);
        fetch('/api/meta-data/trending-tmdb')
          .then(res => res.json())
          .then(data => {
             if (data.results) {
               setTrendingTMDB(data.results);
             }
             setTrendingLoading(false);
          })
          .catch(() => setTrendingLoading(false));
     }
  }, []);

  useEffect(() => {
    if (trendingTMDB.length > 0 && contentList.length > 0 && !flashDismissed && !isWizardMode) {
      const pending = trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id)));
      if (pending.length > 0 && !flashPopupItem) {
        setWizardQueue(pending);
        setFlashPopupItem(pending[0]);
        setFlashCountdown(5);
      }
    }
  }, [trendingTMDB, contentList, flashDismissed, isWizardMode, flashPopupItem]);

  useEffect(() => {
    let timer: any;
    if (flashPopupItem && flashCountdown > 0) {
      timer = setTimeout(() => setFlashCountdown(prev => prev - 1), 1000);
    } else if (flashCountdown === 0 && flashPopupItem) {
      setFlashPopupItem(null);
      setFlashDismissed(true);
    }
    return () => clearTimeout(timer);
  }, [flashPopupItem, flashCountdown]);

  const startWizard = () => {
    setFlashPopupItem(null);
    setFlashDismissed(true);
    setIsWizardMode(true);
    setAdminTab('content');
    window.scrollTo(0, 0);
    setTimeout(() => scourCatalogTMDbApi(wizardQueue[0].id.toString()), 100);
  };

  const skipWizardItem = () => {
    if (wizardQueue.length > 1) {
      const nextQueue = wizardQueue.slice(1);
      setWizardQueue(nextQueue);
      setFormData(initialForm);
      window.scrollTo(0, 0);
      setTimeout(() => scourCatalogTMDbApi(nextQueue[0].id.toString()), 100);
    } else {
      setIsWizardMode(false);
      setWizardQueue([]);
      setFormData(initialForm);
    }
  };
`;

code = code.replace(effectTarget, effectReplace);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Updated Wizard states & effects");
