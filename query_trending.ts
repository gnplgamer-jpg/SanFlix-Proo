import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = collection(db, "Trending");
  const snapshot = await getDocs(q);
  console.log("Trending collection docs:");
  snapshot.forEach(doc => console.log(doc.id, doc.data()));
  process.exit(0);
}
run().catch(console.error);
