const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldAuthEffect = `  useEffect(() => {
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

const newAuthEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
        
        // Fetch user data from firestore
        try {
           const { getDoc } = require('firebase/firestore');
           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
           if (userDoc.exists()) {
             const data = userDoc.data();
             if (data.myListIds) {
               setMyListIds(data.myListIds);
               localStorage.setItem('SANFLIX_MYLIST', JSON.stringify(data.myListIds));
             }
           }
        } catch(e) {
           console.error("Failed to fetch user cloud save", e);
        }

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
console.log('Patched App.tsx auth state to fetch cloud save');
