const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "useEffect(() => {";
const replacement = `useEffect(() => {
    if (localStorage.getItem('SANFLIX_BANNED') === 'true') {
       alert("Your account is permanently banned for cheating.");
       setFraudWarning({ message: "3rd WARNING: You have been permanently banned for attempting to cheat the Admin.", count: 3 });
       setIsLoading(false);
       return;
    }`;

if (!code.includes('Your account is permanently banned for cheating.')) {
  code = code.replace(anchor, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Added ban check at boot.');
} else {
  console.log('Already added ban check.');
}
