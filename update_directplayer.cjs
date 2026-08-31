const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

// Add Download to imports
if (!code.includes('Download } from')) {
  code = code.replace(
    /import \{ ([^}]+) \} from 'lucide-react';/,
    "import { $1, Download } from 'lucide-react';"
  );
}

// Add handleDownload function
const handleDownloadCode = `  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    // Create an invisible anchor tag to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = title || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const togglePiP`;

code = code.replace("  const togglePiP", handleDownloadCode);

// Add the button
const buttonCode = `                   <button 
                     onClick={handleDownload}
                     className="text-white hover:text-white/80 transition bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur flex items-center justify-center"
                     title="Download Video"
                   >
                     <Download className="w-5 h-5" />
                   </button>
                   
                   <button 
                     onClick={togglePiP}`;

code = code.replace("                   <button \n                     onClick={togglePiP}", buttonCode);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
console.log("DirectVideoPlayer updated with download button");
