const fs = require('fs');

// Patch firebase.ts to export getDoc
let firebaseCode = fs.readFileSync('src/firebase.ts', 'utf8');
if (!firebaseCode.includes('getDoc,')) {
    firebaseCode = firebaseCode.replace('import { getFirestore', 'import { getFirestore, getDoc');
    firebaseCode = firebaseCode.replace('export { auth', 'export { auth, getDoc');
    fs.writeFileSync('src/firebase.ts', firebaseCode);
}

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc, getDoc }')) {
    appCode = appCode.replace("import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc } from './firebase';", "import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc, getDoc } from './firebase';");
}

appCode = appCode.replace("const { setDoc } = require('firebase/firestore');", "");
appCode = appCode.replace("const { getDoc } = require('firebase/firestore');", "");

fs.writeFileSync('src/App.tsx', appCode);
console.log('Fixed require to import for firestore');
