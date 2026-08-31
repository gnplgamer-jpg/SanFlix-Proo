const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf-8');

const targetStr = `  const startVoiceRecognition = async () => {
    // Feature disabled as per user request, but keeping the icon for aesthetics
  };`;

const newStr = `  const startVoiceRecognition = async () => {
    setVoiceError('');
    setVoiceTranscript('');
    setVoiceConfirmation(false);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      onSearch(''); // Clear previous search
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setVoiceTranscript(currentTranscript);
      onSearch(currentTranscript);
      
      // If the result is final, show the confirmation banner
      if (event.results[0].isFinal) {
        setVoiceConfirmation(true);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Voice search error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError("Microphone access denied. Please allow it or try opening the app in a new tab.");
      } else if (event.error === 'no-speech') {
        setVoiceError("No speech detected. Try again.");
      } else {
        setVoiceError(\`Voice search error: \${event.error}\`);
      }
      
      // Auto-clear error after 3 seconds
      setTimeout(() => setVoiceError(''), 4000);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!voiceConfirmation && voiceTranscript) { 
        setVoiceConfirmation(true);
      }
    };

    recognition.start();
  };`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/TopHeader.tsx', code);
console.log("Voice search restored");
