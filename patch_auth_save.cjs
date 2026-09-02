const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `        const user = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          isGuest: false,
          photoURL: firebaseUser.photoURL
        };`;

const replacement = `        const user = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          isGuest: false,
          photoURL: firebaseUser.photoURL
        };
        // Save user to Firestore for Admin Panel
        setDoc(doc(db, 'users', firebaseUser.uid), {
           ...user,
           lastLogin: new Date().toISOString(),
           isPremium: localStorage.getItem('SANFLIX_PREMIUM') === 'true'
        }, { merge: true }).catch(console.error);`;

if (!code.includes("doc(db, 'users'")) {
  code = code.replace(anchor, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('User save patched in App.tsx');
} else {
  console.log('User save already exists');
}
