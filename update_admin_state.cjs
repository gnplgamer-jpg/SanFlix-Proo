const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetState = `  const [adminTab, setAdminTab] = useState<'content' | 'reports' | 'shop' | 'trash'>('content');`;
const replacementState = `  const [adminTab, setAdminTab] = useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash'>('content');
  const [trendingTMDB, setTrendingTMDB] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  useEffect(() => {
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
  }, [adminTab]);
`;

code = code.replace(targetState, replacementState);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("State updated in AdminPanel");
