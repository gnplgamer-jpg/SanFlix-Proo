const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const tabStateTarget = `const [adminTab, setAdminTab] = useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash'>('content');`;
const tabStateReplace = `const [adminTab, setAdminTab] = useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash' | 'requests'>('content');
  const [userRequests, setUserRequests] = useState<any[]>([]);`;
code = code.replace(tabStateTarget, tabStateReplace);

const tabsListTarget = `        <button onClick={() => setAdminTab('trash')} className={\`flex-1 py-3 text-sm font-bold border-b-2 transition-colors \${adminTab === 'trash' ? 'border-red-500 text-red-500' : 'border-transparent text-zinc-400 hover:text-white'}\`}>
          Trash ({trash.length})
        </button>`;
const tabsListReplace = `        <button onClick={() => setAdminTab('trash')} className={\`flex-1 py-3 text-sm font-bold border-b-2 transition-colors \${adminTab === 'trash' ? 'border-red-500 text-red-500' : 'border-transparent text-zinc-400 hover:text-white'}\`}>
          Trash ({trash.length})
        </button>
        <button onClick={() => setAdminTab('requests')} className={\`flex-1 py-3 text-sm font-bold border-b-2 transition-colors \${adminTab === 'requests' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-400 hover:text-white'}\`}>
          Requests ({userRequests.filter(r => r.status === 'pending').length})
        </button>`;
code = code.replace(tabsListTarget, tabsListReplace);

const effectTarget = `    // Fetch reports
    const qReports = query(collection(db, 'SanFlix_Reports'));
    const unsubReports = onSnapshot(qReports, (snap) => {
      setReports(snap.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() })));
    });`;
const effectReplace = `    // Fetch reports
    const qReports = query(collection(db, 'SanFlix_Reports'));
    const unsubReports = onSnapshot(qReports, (snap) => {
      setReports(snap.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() })));
    });

    // Fetch requests
    const qRequests = query(collection(db, 'SanFlix_Requests'));
    const unsubRequests = onSnapshot(qRequests, (snap) => {
      setUserRequests(snap.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() })).sort((a, b) => b.created_at - a.created_at));
    });`;
code = code.replace(effectTarget, effectReplace);

const tabViewTarget = `      {adminTab === 'trash' && (`;
const tabViewReplace = `      {adminTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            User Content Requests
          </h2>
          {userRequests.length === 0 ? (
            <div className="text-center text-zinc-500 py-10">No requests found.</div>
          ) : (
            <div className="grid gap-3">
              {userRequests.map((req) => (
                <div key={req.firebase_id} className={\`bg-zinc-900 border \${req.status === 'pending' ? 'border-blue-500/30' : 'border-emerald-500/30'} p-4 rounded-xl flex items-center justify-between\`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={\`text-xs font-bold px-2 py-0.5 rounded-full \${req.type === 'Movie' ? 'bg-red-500/20 text-red-500' : req.type === 'Series' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}\`}>
                        {req.type}
                      </span>
                      <span className={\`text-[10px] font-bold px-2 py-0.5 rounded \${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'}\`}>
                        {req.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-500 ml-2">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg">{req.title}</h3>
                    {req.message && <p className="text-sm text-zinc-400 mt-1 italic">"{req.message}"</p>}
                  </div>
                  <div className="flex gap-2">
                    {req.status === 'pending' && (
                      <button
                        onClick={async () => {
                          const docRef = doc(db, 'SanFlix_Requests', req.firebase_id);
                          await updateDoc(docRef, { status: 'fulfilled' });
                        }}
                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition"
                        title="Mark as Fulfilled"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const docRef = doc(db, 'SanFlix_Requests', req.firebase_id);
                        await deleteDoc(docRef);
                      }}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminTab === 'trash' && (`;
code = code.replace(tabViewTarget, tabViewReplace);

const returnTarget = `      return () => {
        unsubContent();
        unsubTrash();
        unsubReports();
        unsubShop();
      };`;
const returnReplace = `      return () => {
        unsubContent();
        unsubTrash();
        unsubReports();
        unsubShop();
        unsubRequests();
      };`;
code = code.replace(returnTarget, returnReplace);

const importsTarget = `import { Trash2, Edit, Plus, Loader2, Save, X, Search, Image as ImageIcon, PlayCircle, Eye, EyeOff, AlertTriangle, Play, LayoutGrid, List as ListIcon, Check, Store, Link as LinkIcon, ExternalLink, RefreshCw } from 'lucide-react';`;
const importsReplace = `import { Trash2, Edit, Plus, Loader2, Save, X, Search, Image as ImageIcon, PlayCircle, Eye, EyeOff, AlertTriangle, Play, LayoutGrid, List as ListIcon, Check, Store, Link as LinkIcon, ExternalLink, RefreshCw, MessageSquare } from 'lucide-react';`;
code = code.replace(importsTarget, importsReplace);


fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Updated AdminPanel for requests");
