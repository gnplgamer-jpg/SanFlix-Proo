const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetState = `  const [contentSearchTerm, setContentSearchTerm] = useState('');`;

const replacementState = `  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [isCheckingLinks, setIsCheckingLinks] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });

  const runLinkHealthCheck = async () => {
    if (isCheckingLinks) return;
    setIsCheckingLinks(true);
    
    // Filter out items that have no streams
    const itemsToCheck = contentList.filter(item => item.streaming_link_1 || (item.episodes && item.episodes.length > 0 && item.episodes[0].url));
    setCheckProgress({ current: 0, total: itemsToCheck.length });
    
    for (let i = 0; i < itemsToCheck.length; i++) {
       const item = itemsToCheck[i];
       const link = item.streaming_link_1 || item.episodes[0].url;
       try {
          const res = await fetch(\`/api/admin/check-link?url=\${encodeURIComponent(link)}\`);
          const data = await res.json();
          
          const isBroken = !data.ok;
          if (isBroken && !item.needs_update) {
             await updateDoc(doc(db, 'SanFlix_Content', item.firebase_id), { needs_update: true });
          } else if (!isBroken && item.needs_update) {
             await updateDoc(doc(db, 'SanFlix_Content', item.firebase_id), { needs_update: false });
          }
       } catch(e) {}
       
       setCheckProgress({ current: i + 1, total: itemsToCheck.length });
       
       // Sleep 1s to prevent spamming
       await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsCheckingLinks(false);
  };
`;

if (!code.includes('runLinkHealthCheck')) {
   code = code.replace(targetState, replacementState);
   fs.writeFileSync('src/components/AdminPanel.tsx', code);
   console.log("Added runLinkHealthCheck state");
}
