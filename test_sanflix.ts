import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = collection(db, "SanFlix_Content");
  await addDoc(q, { title: "Test" });
  console.log("Seeded SanFlix_Content");
  process.exit(0);
}
run().catch(console.error);
