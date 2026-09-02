const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add auth import
if (!code.includes('import { auth }')) {
  code = code.replace("import { db, collection, getDocs, onSnapshot, addDoc, query, doc } from './firebase';", "import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged } from './firebase';");
} else if (!code.includes('onAuthStateChanged')) {
   code = code.replace("import { auth }", "import { auth, onAuthStateChanged }");
}

// 2. Replace the useEffect for user state
const oldAuthEffect = `  useEffect(() => {
    const savedUser = localStorage.getItem('sanflix_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);`;

const newAuthEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          isGuest: false,
          photoURL: firebaseUser.photoURL
        };
        setUser(user);
        localStorage.setItem('sanflix_user', JSON.stringify(user));
      } else {
        const savedUser = localStorage.getItem('sanflix_user');
        if (savedUser) {
          try {
             const parsed = JSON.parse(savedUser);
             if (parsed.isGuest) {
               setUser(parsed);
               return;
             }
          } catch (e) {
             console.error(e);
          }
        }
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);`;

code = code.replace(oldAuthEffect, newAuthEffect);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched Auth in App.tsx');
