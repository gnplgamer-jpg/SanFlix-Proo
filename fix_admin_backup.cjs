const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// 1. Initial form state
code = code.replace(
  `  streaming_link_3: '',
  stream_type: 'Auto-Detect',
  episodes: [{ title: 'Episode 1', url: '', download_url: '' }],`,
  `  streaming_link_3: '',
  streaming_link_4: '',
  stream_type: 'Auto-Detect',
  episodes: [{ title: 'Episode 1', url: '', url_2: '', url_3: '', url_4: '', download_url: '' }],`
);

// 2. Edit mode state mapping
code = code.replace(
  `      streaming_link_3: item.streaming_link_3 || '',
      stream_type: item.stream_type || 'Auto-Detect',
      episodes: item.episodes && item.episodes.length > 0 ? item.episodes : [{ title: 'Episode 1', url: item.streaming_link_1 || '', download_url: '' }],`,
  `      streaming_link_3: item.streaming_link_3 || '',
      streaming_link_4: item.streaming_link_4 || '',
      stream_type: item.stream_type || 'Auto-Detect',
      episodes: item.episodes && item.episodes.length > 0 ? item.episodes : [{ title: 'Episode 1', url: item.streaming_link_1 || '', url_2: '', url_3: '', url_4: '', download_url: '' }],`
);

// 3. Add states
code = code.replace(
  `  const [isAddingCustomCat, setIsAddingCustomCat] = useState(false);`,
  `  const [isAddingCustomCat, setIsAddingCustomCat] = useState(false);
  const [adminTab, setAdminTab] = useState<'content' | 'reports'>('content');
  const [reports, setReports] = useState<any[]>([]);`
);

// 4. Load reports in useEffect
code = code.replace(
  `  useEffect(() => {
    const q = query(collection(db, 'SanFlix_Content'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {`,
  `  useEffect(() => {
    const rq = query(collection(db, 'SanFlix_Reports'), orderBy('timestamp', 'desc'));
    const unsubsReports = onSnapshot(rq, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const q = query(collection(db, 'SanFlix_Content'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {`
);

code = code.replace(
  `    return () => unsubscribe();
  }, []);`,
  `    return () => { unsubscribe(); unsubsReports(); };
  }, []);`
);

// 5. Delete report func
code = code.replace(
  `  const deleteItem = async (id: string, title: string) => {`,
  `  const resolveReport = async (id: string) => {
    try {
       await deleteDoc(doc(db, 'SanFlix_Reports', id));
    } catch(e) {}
  };

  const deleteItem = async (id: string, title: string) => {`
);

// 6. Fix tabs UI
code = code.replace(
  `    <div className="px-4 py-8 bg-zinc-950 min-h-screen text-white">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Content Injector</h2>
          <p className="text-sm text-zinc-400">Add, Edit, and Manage SanFlix Catalog</p>
        </div>`,
  `    <div className="px-4 py-8 bg-zinc-950 min-h-screen text-white">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">SanFlix Admin</h2>
          <div className="flex gap-4 mt-2">
            <button onClick={() => setAdminTab('content')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'content' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Content Injector</button>
            <button onClick={() => setAdminTab('reports')} className={\`text-sm font-bold pb-1 border-b-2 flex items-center gap-2 \${adminTab === 'reports' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>
               Reports {reports.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{reports.length}</span>}
            </button>
          </div>
        </div>`
);

// 7. Render reports conditionally
const renderReports = `
      {adminTab === 'reports' ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">User Reports</h3>
          {reports.length === 0 ? (
            <div className="text-zinc-500 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 text-center">No pending reports.</div>
          ) : (
            reports.map(rep => (
              <div key={rep.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-red-500 mb-1">Broken Link Reported</h4>
                    <p className="font-bold text-white text-lg">{rep.movieTitle} {rep.episodeTitle ? \` - \${rep.episodeTitle}\` : ''}</p>
                    <p className="text-xs text-zinc-400 mt-1">Failed URL: <span className="text-zinc-500 break-all">{rep.failedUrl}</span></p>
                  </div>
                  <button onClick={() => resolveReport(rep.id)} className="bg-green-600/20 text-green-500 hover:bg-green-600/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">Mark Resolved</button>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg mt-2">
                   <p className="text-xs text-zinc-400 mb-2">Quick Update (Link 1):</p>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       id={\`quick-url-\${rep.id}\`}
                       placeholder="Enter new working URL..." 
                       className="flex-1 bg-zinc-900 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none" 
                     />
                     <button 
                       onClick={async () => {
                         const inp = document.getElementById(\`quick-url-\${rep.id}\`) as HTMLInputElement;
                         if(!inp || !inp.value) return;
                         try {
                           const movieRef = doc(db, 'SanFlix_Content', rep.movieId);
                           if (rep.episodeTitle && rep.episodeIdx !== undefined) {
                             // Get movie first to update specific episode
                             const mSnap = contentList.find(m => m.firebase_id === rep.movieId);
                             if (mSnap && mSnap.episodes) {
                               const eps = [...mSnap.episodes];
                               if (eps[rep.episodeIdx]) {
                                 eps[rep.episodeIdx].url = inp.value;
                                 await updateDoc(movieRef, { episodes: eps });
                               }
                             }
                           } else {
                             await updateDoc(movieRef, { streaming_link_1: inp.value });
                           }
                           await deleteDoc(doc(db, 'SanFlix_Reports', rep.id));
                         } catch(e) {
                           alert('Failed to update');
                         }
                       }}
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                     >
                       Update & Resolve
                     </button>
                     <button
                       onClick={() => {
                          const item = contentList.find(m => m.firebase_id === rep.movieId);
                          if(item) {
                            setAdminTab('content');
                            editItem(item);
                          }
                       }}
                       className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-700 transition"
                     >
                       Full Edit
                     </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
`;

code = code.replace(
  `      {error && (`,
  renderReports + `\n      {error && (`
);

const closeTab = `
      )}
      {/* Floating Bulk Action Bar */}`;

code = code.replace(
  `      {/* Floating Bulk Action Bar */}`,
  closeTab
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
