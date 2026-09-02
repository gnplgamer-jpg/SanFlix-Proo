const fs = require('fs');
let code = fs.readFileSync('src/components/LiveTvScreen.tsx', 'utf8');

// 1. Add audio tracks state
const stateRegex = /const \[currentQuality, setCurrentQuality\] = useState<number>\(-1\);/;
const stateReplacement = `const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [audioTracks, setAudioTracks] = useState<{id: number, name: string}[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(-1);`;
code = code.replace(stateRegex, stateReplacement);

// 2. Extract audio tracks on parsed
const hlsParsedRegex = /hls\.on\(Hls\.Events\.MANIFEST_PARSED, \(event, data\) => \{/;
const hlsParsedReplacement = `hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableAudio = hls.audioTracks.map((t, i) => ({ id: i, name: t.name || t.language || 'Track ' + (i+1) }));
        setAudioTracks(availableAudio);
        setCurrentAudio(hls.audioTrack);`;
code = code.replace(hlsParsedRegex, hlsParsedReplacement);

// 3. Add audio track selector UI in Settings Modal
const qualityRegex = /\{qualities\.length > 0 && \([\s\S]*?<\/>\s*\)\}/;
// Actually, let's just insert it after the Quality Selector closing tag
const insertAudioRegex = /<\/select>\s*<\/div>\s*\)\}/;
const insertAudioReplacement = `</select>
                </div>
              )}
              
              {/* Audio Track Selector */}
              {audioTracks.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Audio Language</label>
                  <select 
                    className="w-full bg-zinc-800 text-sm rounded-lg p-2 border border-zinc-700 outline-none"
                    value={currentAudio}
                    onChange={(e) => {
                      const trackId = parseInt(e.target.value);
                      setCurrentAudio(trackId);
                      if (hlsRef.current) {
                        hlsRef.current.audioTrack = trackId;
                      }
                    }}
                  >
                    {audioTracks.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}`;
code = code.replace(insertAudioRegex, insertAudioReplacement);

fs.writeFileSync('src/components/LiveTvScreen.tsx', code);
console.log('Added Audio Track settings!');
