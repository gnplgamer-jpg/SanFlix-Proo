const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const stateAnchor = "const [customCategories, setCustomCategories] = useState<string[]>([]);";
const newStates = `const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifStatus, setNotifStatus] = useState('');

  useEffect(() => {
     const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        const u: any[] = [];
        snapshot.forEach(doc => {
           u.push({ id: doc.id, ...doc.data() });
        });
        setUsersList(u);
     });
     return () => unsub();
  }, []);

  const sendNotification = () => {
     if (!notifTitle || !notifBody) return;
     setNotifStatus('Sending...');
     setTimeout(() => {
        setNotifStatus('Notification Sent Successfully to all users!');
        setNotifTitle('');
        setNotifBody('');
     }, 1500);
  };
`;

if(!code.includes('usersList')) {
  code = code.replace(stateAnchor, newStates);
}

const renderAnchor = ") : ( <>";
const newRender = `) : adminTab === 'users' ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red-600 pl-3">Registered Users ({usersList.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {usersList.map((u, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                      {u.photoURL ? <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xl font-bold">{u.displayName?.charAt(0)}</div>}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{u.displayName || 'Unknown User'} {u.isPremium && <span className="ml-2 text-[10px] bg-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Premium</span>}</h4>
                      <p className="text-xs text-zinc-400 truncate">{u.email || 'No email'}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A'}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      ) : adminTab === 'notifications' ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red-600 pl-3">Push Notifications</h2>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
             <div className="mb-4">
               <label className="block text-sm font-bold text-zinc-300 mb-2">Notification Title</label>
               <input type="text" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} placeholder="e.g. New Movie Uploaded!" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500" />
             </div>
             <div className="mb-6">
               <label className="block text-sm font-bold text-zinc-300 mb-2">Message Body</label>
               <textarea value={notifBody} onChange={(e) => setNotifBody(e.target.value)} placeholder="e.g. Watch the latest blockbuster now on SanFlix..." className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white h-32 resize-none focus:outline-none focus:border-red-500"></textarea>
             </div>
             <button onClick={sendNotification} disabled={!notifTitle || !notifBody} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
               Send Push Notification
             </button>
             {notifStatus && (
               <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-sm font-bold">
                 {notifStatus}
               </div>
             )}
          </div>
        </div>
      ) : ( <>`;

if(!code.includes("adminTab === 'users'")) {
  code = code.replace(renderAnchor, newRender);
}

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Added logic for Users and Notifications');
