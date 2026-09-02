const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Remove from inside useEffect
code = code.replace(/  const submitReport = async \(\) => \{[\s\S]*?alert\("Error sending report\."\);\n    \}\n  \};\n/g, '');

// Insert it right after the formatTime function so it's in the component scope
const insertRegex = /const formatTime = \(sec: number\) => \{[\s\S]*?return \`\$\{m\}:\$\{s < 10 \? '0' : undefined\}\$\{s\}\`;\n  \};/;
const insertReplacement = `const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return \`\$\{m\}:\$\{s < 10 ? '0' : ''\}\$\{s\}\`;
  };

  const submitReport = async () => {
    if (!currentChannel) return;
    try {
      await addDoc(collection(db, 'SanFlix_Reports'), {
        movieTitle: \`Live TV: \${currentChannel.name}\`,
        failedUrl: currentChannel.url,
        description: reportText,
        type: 'LiveTV',
        timestamp: new Date().toISOString()
      });
      setShowReportModal(false);
      setReportText('');
      alert("Report sent to Admin. Thank you!");
    } catch(e) {
      console.error(e);
      alert("Error sending report.");
    }
  };`;
code = code.replace(insertRegex, insertReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed submitReport correctly!');
