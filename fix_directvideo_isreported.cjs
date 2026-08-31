const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

code = code.replace("  const [isReported, setIsReported] = useState(false);\n", "");

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
