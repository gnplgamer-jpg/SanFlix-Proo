const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const stateTarget = `  const [isSearchActive, setIsSearchActive] = useState(false);`;
const stateReplace = `  const [isSearchActive, setIsSearchActive] = useState(false);\n  const [isRequestOpen, setIsRequestOpen] = useState(false);`;
code = code.replace(stateTarget, stateReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Added isRequestOpen to App.tsx");
