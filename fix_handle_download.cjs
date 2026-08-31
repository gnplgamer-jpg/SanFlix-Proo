const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetMethod = `  const handleDownload = (e?: React.MouseEvent) => {
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
  };`;

const proxyMethod = `  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isLocked) return;
    
    // Create an invisible anchor tag to trigger the download through our proxy
    const downloadUrl = \`/api/proxy/download?url=\${encodeURIComponent(url)}&title=\${encodeURIComponent(title || 'video')}\`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = title ? \`\${title}.mp4\` : 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };`;

if (code.includes(targetMethod)) {
   code = code.replace(targetMethod, proxyMethod);
   fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
   console.log("Updated handleDownload to use proxy");
} else {
   console.log("Could not find targetMethod in DirectVideoPlayer.tsx");
}
