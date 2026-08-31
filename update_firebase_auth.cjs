const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf-8');

const importTarget = `import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";`;
const importReplace = `import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";`;
code = code.replace(importTarget, importReplace);

const exportTarget = `export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit };`;
const exportReplace = `export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit };`;
code = code.replace(exportTarget, exportReplace);

fs.writeFileSync('src/firebase.ts', code);
console.log("Updated firebase.ts with Email Auth");
