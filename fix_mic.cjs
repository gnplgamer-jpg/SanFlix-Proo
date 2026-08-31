const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const targetStr = `  const startVoiceRecognition = async () => {
    setVoiceError('');
    setVoiceTranscript('');
    setVoiceConfirmation(false);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();`;

const replacementStr = `  const startVoiceRecognition = async () => {
    setVoiceError('');
    setVoiceTranscript('');
    setVoiceConfirmation(false);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    try {
      // Prompt for permission explicitly, which fixes the silent 'not-allowed' error in some iframe contexts
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setVoiceError("Microphone access needed for voice search.");
      setTimeout(() => setVoiceError(''), 3000);
      return;
    }

    const recognition = new SpeechRecognition();`;

code = code.replace(targetStr, replacementStr);

const errorTargetStr = `      if (event.error === 'not-allowed') {
        setVoiceError("Microphone access denied. Please allow it or try opening the app in a new tab.");
      } else if (event.error === 'no-speech') {
        setVoiceError("No speech detected. Try again.");
      } else {
        setVoiceError(\`Voice search error: \${event.error}\`);
      }`;

const errorReplacementStr = `      if (event.error === 'not-allowed') {
        setVoiceError("Microphone access is blocked in settings.");
      } else if (event.error === 'no-speech') {
        setVoiceError("No speech detected. Try again.");
      } else {
        // Silently ignore other minor errors to avoid annoying the user
        console.warn(\`Voice search error: \${event.error}\`);
      }`;

code = code.replace(errorTargetStr, errorReplacementStr);

fs.writeFileSync('src/components/TopHeader.tsx', code);
console.log("Mic error handling updated");
