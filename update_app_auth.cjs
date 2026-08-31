const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importTarget = `import { db, collection, getDocs, onSnapshot, addDoc, query, doc } from './firebase';`;
const importReplace = `import { db, collection, getDocs, onSnapshot, addDoc, query, doc, auth, onAuthStateChanged } from './firebase';`;
code = code.replace(importTarget, importReplace);

const stateTarget = `  const [isLightMode, setIsLightMode] = useState(false);`;
const stateReplace = `  const [isLightMode, setIsLightMode] = useState(false);\n  const [user, setUser] = useState<any>(null);`;
code = code.replace(stateTarget, stateReplace);

const effectTarget = `  useEffect(() => {
    const fetchPromo = async () => {`;
const effectReplace = `  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchPromo = async () => {`;
code = code.replace(effectTarget, effectReplace);

const profileTarget = `<ProfileHub 
          isAdultEnabled={isAdultEnabled}
          setIsAdultEnabled={setIsAdultEnabled}
          isAdminUnlocked={isAdminUnlocked}
          setIsAdminUnlocked={setIsAdminUnlocked}
          onChangeTab={setActiveTab}
          batterySaver={batterySaver}
          setBatterySaver={setBatterySaver}
        />`;
const profileReplace = `<ProfileHub 
          isAdultEnabled={isAdultEnabled}
          setIsAdultEnabled={setIsAdultEnabled}
          isAdminUnlocked={isAdminUnlocked}
          setIsAdminUnlocked={setIsAdminUnlocked}
          onChangeTab={setActiveTab}
          batterySaver={batterySaver}
          setBatterySaver={setBatterySaver}
          user={user}
        />`;
code = code.replace(profileTarget, profileReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with Auth");
