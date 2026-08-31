import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = query(collection(db, "SanFlix_Content"), limit(1));
  const snapshot = await getDocs(q);
  console.log("SanFlix_Content docs count:", snapshot.size);
  process.exit(0);
}
run().catch(console.error);
