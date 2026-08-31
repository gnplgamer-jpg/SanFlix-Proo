const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetEffect = `  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'SanFlix_Content'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() }));
      setContentList(list);
    }, (error) => {
      console.error("Error fetching content:", error);
    });
    return () => { unsubscribe(); unsubsReports(); };
  }, []);`;

const replaceEffect = `  useEffect(() => {
    if (!db) return;
    const rq = query(collection(db, 'SanFlix_Reports'));
    const unsubsReports = onSnapshot(rq, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const q = query(collection(db, 'SanFlix_Content'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ firebase_id: doc.id, ...doc.data() }));
      setContentList(list);
    }, (error) => {
      console.error("Error fetching content:", error);
    });
    return () => { unsubscribe(); unsubsReports(); };
  }, []);`;

code = code.replace(targetEffect, replaceEffect);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
