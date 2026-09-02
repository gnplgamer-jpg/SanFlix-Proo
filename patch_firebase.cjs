const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

if (!code.includes('setDoc')) {
   code = code.replace('import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setLogLevel, where, limit } from "firebase/firestore";', 'import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setLogLevel, where, limit, setDoc } from "firebase/firestore";');
   code = code.replace('export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit };', 'export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, limit, setDoc };');
}
fs.writeFileSync('src/firebase.ts', code);
console.log('Patched firebase.ts with setDoc');
