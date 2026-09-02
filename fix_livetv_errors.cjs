const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// Fix submitReport scoping: remove it from useEffect and place it before return
const submitReportRegex = /\s*const submitReport = async \(\) => \{[\s\S]*?alert\("Error sending report\."\);\s*\}\s*\};\n/;
code = code.replace(submitReportRegex, '\n');

const insertSubmitRegex = /return \(/;
const insertSubmitReplacement = `const submitReport = async () => {
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
code = code.replace(insertSubmitRegex, insertSubmitReplacement);

// Fix TS error: Property 'language' does not exist on type 'MediaPlaylist'
const audioTrackRegex = /const availableAudio = hls\.audioTracks\.map\(\(t, i\) => \(\{ id: i, name: t\.name \|\| \(t as any\)\.language \|\| 'Track ' \+ \(i\+1\) \}\)\);/g;
// Actually, let's just make sure it's safely cast. The current code might just be `t.language`.
const origAudioTrackRegex = /const availableAudio = hls\.audioTracks\.map\(\(t, i\) => \(\{ id: i, name: t\.name \|\| t\.language \|\| 'Track ' \+ \(i\+1\) \}\)\);/g;
code = code.replace(origAudioTrackRegex, `const availableAudio = hls.audioTracks.map((t: any, i: number) => ({ id: i, name: t.name || t.language || 'Track ' + (i+1) }));`);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Fixed submitReport scoping and audioTrack typings');
