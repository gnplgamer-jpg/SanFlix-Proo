const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const targetRegex = /const startVoiceRecognition = async \(\) => \{[\s\S]*?recognition\.start\(\);\n  \};/;
const newCode = `const startVoiceRecognition = async () => {
    // Feature disabled as per user request, but keeping the icon for aesthetics
  };`;

if (targetRegex.test(code)) {
    code = code.replace(targetRegex, newCode);
    fs.writeFileSync('src/components/TopHeader.tsx', code);
    console.log('Disabled voice search successfully');
} else {
    console.log('Could not find startVoiceRecognition block');
}
