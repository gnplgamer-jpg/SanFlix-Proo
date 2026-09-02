const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Insert submitReport before return (
const returnRegex = /return \(/;
const returnReplacement = `const submitReport = async () => {
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
  };

  return (`

code = code.replace(returnRegex, returnReplacement);
fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed submitReport');
