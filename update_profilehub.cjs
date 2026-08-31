const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const interfaceTarget = `interface ProfileHubProps {
  isAdultEnabled: boolean;`;
const interfaceReplace = `interface ProfileHubProps {
  user?: any;
  isAdultEnabled: boolean;`;
code = code.replace(interfaceTarget, interfaceReplace);

const argsTarget = `export function ProfileHub({
  isAdultEnabled,`;
const argsReplace = `export function ProfileHub({
  user,
  isAdultEnabled,`;
code = code.replace(argsTarget, argsReplace);

const importTarget = `import { motion, AnimatePresence } from 'motion/react';`;
const importReplace = `import { motion, AnimatePresence } from 'motion/react';\nimport { auth, googleProvider, signInWithPopup, signOut } from '../firebase';`;
code = code.replace(importTarget, importReplace);

const loginUItarget = `      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-500 p-0.5">
          <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border-2 border-black">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Guest User</h2>
          <p className="text-sm text-zinc-400">Free Tier</p>
        </div>
      </div>`;
const loginUIreplace = `      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-500 p-0.5 overflow-hidden">
          <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border-2 border-black overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-white">{user?.displayName ? user.displayName[0] : 'G'}</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{user?.displayName || 'Guest User'}</h2>
          <p className="text-sm text-zinc-400">{user?.email || 'Free Tier'}</p>
        </div>
        <div>
          {user ? (
            <button 
              onClick={() => signOut(auth)}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition"
            >
              Log Out
            </button>
          ) : (
            <button 
              onClick={() => signInWithPopup(auth, googleProvider).catch(err => console.error(err))}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>`;
code = code.replace(loginUItarget, loginUIreplace);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
console.log("Updated ProfileHub");
