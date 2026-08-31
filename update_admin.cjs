const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// 1. Update State
code = code.replace(
  "const [adminTab, setAdminTab] = useState<'content' | 'reports' | 'shop'>('content');",
  "const [adminTab, setAdminTab] = useState<'content' | 'reports' | 'shop' | 'trash'>('content');"
);

// 2. Update Delete Logic
code = code.replace(
  `  const deleteItem = async (id: string, title: string) => {
    if (!id) {
      setError("Error: Missing item ID");
      return;
    }
    try {
      setContentList(prev => prev.filter(item => item.firebase_id !== id));
      await deleteDoc(doc(db, 'SanFlix_Content', id));
    } catch (err: any) {
      setError("Failed to delete: " + err.message);
    }
  };`,
  `  const deleteItem = async (id: string, title: string) => {
    if (!id) {
      setError("Error: Missing item ID");
      return;
    }
    try {
      // SOFT DELETE
      setContentList(prev => prev.map(item => item.firebase_id === id ? { ...item, is_deleted: true } : item));
      await updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: true, deleted_at: new Date().toISOString() });
    } catch (err: any) {
      setError("Failed to soft delete: " + err.message);
    }
  };

  const hardDeleteItem = async (id: string) => {
    try {
      setContentList(prev => prev.filter(item => item.firebase_id !== id));
      await deleteDoc(doc(db, 'SanFlix_Content', id));
    } catch (err: any) {
      setError("Failed to hard delete: " + err.message);
    }
  };

  const restoreItem = async (id: string) => {
    try {
      setContentList(prev => prev.map(item => item.firebase_id === id ? { ...item, is_deleted: false } : item));
      await updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: false });
    } catch (err: any) {
      setError("Failed to restore: " + err.message);
    }
  };`
);

code = code.replace(
  `  const deleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const idsToDelete = [...selectedItems];
      setContentList(prev => prev.filter(item => !idsToDelete.includes(item.firebase_id)));
      setSelectedItems([]);
      
      await Promise.all(idsToDelete.map(id => deleteDoc(doc(db, 'SanFlix_Content', id))));
    } catch (err: any) {
      setError("Failed to delete some items: " + err.message);
    }
  };`,
  `  const deleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const idsToDelete = [...selectedItems];
      setContentList(prev => prev.map(item => idsToDelete.includes(item.firebase_id) ? { ...item, is_deleted: true } : item));
      setSelectedItems([]);
      
      await Promise.all(idsToDelete.map(id => updateDoc(doc(db, 'SanFlix_Content', id), { is_deleted: true, deleted_at: new Date().toISOString() })));
    } catch (err: any) {
      setError("Failed to soft delete some items: " + err.message);
    }
  };`
);

code = code.replace(
  `  const filteredContent = contentList.filter(item => {
    if (item.id === 'TRENDING_SEARCHES') return false;
    const matchesTab = contentTab === '18+' ? !!item.ad_gate : !item.ad_gate;
    const matchesSearch = (item.title || '').toLowerCase().includes(contentSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });`,
  `  const filteredContent = contentList.filter(item => {
    if (item.id === 'TRENDING_SEARCHES') return false;
    if (item.is_deleted) return false;
    const matchesTab = contentTab === '18+' ? !!item.ad_gate : !item.ad_gate;
    const matchesSearch = (item.title || '').toLowerCase().includes(contentSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  
  const trashContent = contentList.filter(item => item.is_deleted);`
);

code = code.replace(
  `<button onClick={() => setAdminTab('shop')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'shop' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Shop Products</button>`,
  `<button onClick={() => setAdminTab('shop')} className={\`text-sm font-bold pb-1 border-b-2 \${adminTab === 'shop' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>Shop Products</button>
            <button onClick={() => setAdminTab('trash')} className={\`text-sm font-bold pb-1 border-b-2 flex items-center gap-2 \${adminTab === 'trash' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}\`}>
               Trash {trashContent.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{trashContent.length}</span>}
            </button>`
);


fs.writeFileSync('src/components/AdminPanel.tsx', code);
