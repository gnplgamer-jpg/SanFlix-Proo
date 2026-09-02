const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure updateDoc and doc are imported from firebase
if (!code.includes('import { db,')) {
    // we already patched firebase imports earlier
}

const toggleMyListRegex = /const toggleMyList = [\s\S]*?localStorage\.setItem\('SANFLIX_MYLIST', JSON\.stringify\(newML\)\);\n  };/m;
const newToggleMyList = `const toggleMyList = async (e: React.MouseEvent, movie: any) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const id = movie.id || movie.firebase_id;
    let newML;
    if (myListIds.includes(id)) {
      newML = myListIds.filter(item => item !== id);
    } else {
      newML = [id, ...myListIds];
    }
    setMyListIds(newML);
    localStorage.setItem('SANFLIX_MYLIST', JSON.stringify(newML));
    
    // Sync to Firestore if not guest
    if (user && !user.isGuest) {
       try {
         await updateDoc(doc(db, 'users', user.uid), { myListIds: newML });
       } catch (err: any) {
         if (err.code === 'not-found') {
             try {
                const { setDoc } = require('firebase/firestore');
                await setDoc(doc(db, 'users', user.uid), { myListIds: newML }, { merge: true });
             } catch (e) {
                console.error("Failed to create user doc for myList", e);
             }
         } else {
             console.error("Failed to sync myList to Firestore", err);
         }
       }
    }
  };`;

code = code.replace(toggleMyListRegex, newToggleMyList);

if (!code.includes('import { setDoc }')) {
    code = code.replace("import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged } from './firebase';", "import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc } from './firebase';");
    // Also patch firebase.ts to export setDoc
}

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx toggleMyList');
