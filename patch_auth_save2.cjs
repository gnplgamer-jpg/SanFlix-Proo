const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));`;
const replacement = `           
           // Ensure user is in database for admin panel
           await setDoc(doc(db, 'users', firebaseUser.uid), {
             uid: firebaseUser.uid,
             displayName: firebaseUser.displayName || 'User',
             email: firebaseUser.email,
             photoURL: firebaseUser.photoURL,
             lastLogin: new Date().toISOString()
           }, { merge: true });

           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));`;

code = code.replace(anchor, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('User save patched in App.tsx');
