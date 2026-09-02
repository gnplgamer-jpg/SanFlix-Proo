const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `const networks = [
    { label: "NETFLIX", bgClass: "bg-red-600", textClass: "text-white" },
    { label: "PRIME VIDEO", bgClass: "bg-blue-600", textClass: "text-white" },
    { label: "ALTBALAJI", bgClass: "bg-orange-600", textClass: "text-white" },
    { label: "SONYLIV", bgClass: "bg-yellow-500", textClass: "text-black" },
    { label: "MX PLAYER", bgClass: "bg-blue-800", textClass: "text-white" }
  ];`;

const replacement = `const networks = [
    { id: 'netflix', name: 'NETFLIX', label: 'NETFLIX', colorClass: 'from-red-600 to-red-900 border-red-500/50', initial: 'N', textClass: 'text-white' },
    { id: 'prime', name: 'PRIME VIDEO', label: 'PRIME VIDEO', colorClass: 'from-blue-600 to-cyan-900 border-blue-500/50', initial: 'P', textClass: 'text-white' },
    { id: 'altbalaji', name: 'ALTBALAJI', label: 'ALTBALAJI', colorClass: 'from-orange-600 to-red-900 border-orange-500/50', initial: 'A', textClass: 'text-white' },
    { id: 'sonyliv', name: 'SONYLIV', label: 'SONYLIV', colorClass: 'from-yellow-500 to-yellow-800 border-yellow-500/50', initial: 'S', textClass: 'text-black' },
    { id: 'mxplayer', name: 'MX PLAYER', label: 'MX PLAYER', colorClass: 'from-blue-800 to-blue-950 border-blue-800/50', initial: 'M', textClass: 'text-white' }
  ];`;

code = code.replace(anchor, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed networks');
