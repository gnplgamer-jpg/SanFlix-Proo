const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetStr = `  const handleCast = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    // Try official Cast Framework first`;

const newStr = `  const handleCast = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    if (url.startsWith('blob:')) {
      alert("Casting is not supported for downloaded offline videos.");
      return;
    }

    // Try official Cast Framework first`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
