const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetEffect = `  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'SanFlix_Content'));`;

const replaceEffect = `  useEffect(() => {
    if (!db) return;
    
    let unsubsReports = () => {};
    try {
      const rq = query(collection(db, 'SanFlix_Reports'));
      unsubsReports = onSnapshot(rq, (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } catch(e) {}

    const q = query(collection(db, 'SanFlix_Content'));`;

code = code.replace(targetEffect, replaceEffect);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
