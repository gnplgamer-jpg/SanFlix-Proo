const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add 'update' to adminTab
code = code.replace(
  "useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash' | 'requests'>('content')",
  "useState<'content' | 'tmdb' | 'reports' | 'shop' | 'trash' | 'requests' | 'update'>('content')"
);
code = code.replace(
  "const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });",
  `const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });
  const [appUpdateData, setAppUpdateData] = useState({ version: '', url: '', changelog: '' });
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'SanFlix_Config', 'app_update'), (doc) => {
      if (doc.exists()) {
        setAppUpdateData(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);
  
  const saveAppUpdate = async () => {
    try {
      // using setDoc to create or update
      const { setDoc } = require('firebase/firestore');
      await setDoc(doc(db, 'SanFlix_Config', 'app_update'), appUpdateData);
      alert('App update settings saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save app update settings');
    }
  };`
);

// We need to add firebase setDoc import if not present
if (!code.includes('setDoc')) {
  code = code.replace("updateDoc, deleteDoc", "updateDoc, deleteDoc, setDoc");
}

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('patched state for update');
