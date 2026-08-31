const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf-8');

const importTarget = `import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setLogLevel, where, limit } from "firebase/firestore";`;
const importReplace = `import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setLogLevel, where, limit } from "firebase/firestore";\nimport { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";`;
code = code.replace(importTarget, importReplace);

const exportTarget = `export { db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit };`;
const exportReplace = `const auth = getAuth(app);\nconst googleProvider = new GoogleAuthProvider();\nexport { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit };`;
code = code.replace(exportTarget, exportReplace);

fs.writeFileSync('src/firebase.ts', code);
console.log("Updated firebase.ts");
