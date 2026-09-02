const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importAnchor = "import { Info, Play, Clock, Star, Tv, Heart, History, ChevronLeft, ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';";
const newImport = "import { Info, Play, Clock, Star, Tv, Heart, History, ChevronLeft, ChevronDown, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';";
code = code.replace(importAnchor, newImport);

const firebaseImport = "import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc, getDoc } from './firebase';";
const newFirebaseImport = "import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged, setDoc, getDoc, updateDoc } from './firebase';";
code = code.replace(firebaseImport, newFirebaseImport);

const timerRegex = /setFraudWarning\(\{ message: "3rd WARNING: You have been permanently banned for attempting to cheat the Admin.", count: 3 \}\);\s*setIsLoading\(false\);/;
code = code.replace(timerRegex, '');

// There is one error for globalVideo type: missing isAdPlaying and showPremiumModal
const globalVideoAnchor = `showAuthModal: boolean;`;
const newGlobalVideo = `showAuthModal: boolean;
  showPremiumModal: boolean;
  isAdPlaying: boolean;`;
if (!code.includes("showPremiumModal: boolean;")) {
  code = code.replace(globalVideoAnchor, newGlobalVideo);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed syntax errors');
