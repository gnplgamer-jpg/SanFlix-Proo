import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  await setDoc(doc(db, "SanFlix_Content", "TRENDING_SEARCHES"), {
    type: "trending_searches",
    queries: ["Action Movies", "Horror", "Comedy", "Bhojpuri", "Sci-Fi"]
  });
  console.log("Seeded trending searches into SanFlix_Content");
  process.exit(0);
}
run().catch(console.error);
