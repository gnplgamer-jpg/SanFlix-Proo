const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /useEffect\(\(\) => \{\s+const unsubscribeAuth = onAuthStateChanged\(auth, \(currentUser\) => \{\s+setUser\(currentUser\);\s+\}\);\s+return \(\) => unsubscribeAuth\(\);\s+\}, \[\]\);/g,
  `useEffect(() => {
    const savedUser = localStorage.getItem('sanflix_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);`
);
fs.writeFileSync('src/App.tsx', content);
