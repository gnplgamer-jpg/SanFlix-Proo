import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = collection(db, "Trending");
  await addDoc(q, { query: "Action Movies" });
  await addDoc(q, { query: "Horror" });
  await addDoc(q, { query: "Comedy" });
  console.log("Seeded trending");
  process.exit(0);
}
run().catch(console.error);
