const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf-8');

const targetGate = `<h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider text-[#E50914]">Restriction Warning</h3>
                  <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                    {isAdultEnabled 
                      ? "You are about to hide 18+ content from your feed. It will be removed from your categories." 
                      : "You are attempting to access 18+ restricted networks. You must explicitly agree that you are over 18 years of age."}
                  </p>`;

const newGate = `{toggleTarget === 'phub' ? (
                    <>
                      <h3 className="text-xl font-black text-orange-500 mb-2 uppercase tracking-wider">⚠️ चेतावनी (Warning)</h3>
                      <p className="text-[14px] text-zinc-300 leading-relaxed font-medium">
                        {localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true'
                          ? "आप एडल्ट (Porn) कंटेंट बंद कर रहे हैं। यह आपकी स्क्रीन से हटा दिया जाएगा।"
                          : "सावधान! आप अब एडल्ट (Porn) कंटेंट चालू कर रहे हैं। यह सामग्री केवल 18+ दर्शकों के लिए है। क्या आप सच में इसे चालू करना चाहते हैं?"}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider text-[#E50914]">Restriction Warning</h3>
                      <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                        {isAdultEnabled 
                          ? "You are about to hide 18+ content from your feed. It will be removed from your categories." 
                          : "You are attempting to access 18+ restricted networks. You must explicitly agree that you are over 18 years of age."}
                      </p>
                    </>
                  )}`;

code = code.replace(targetGate, newGate);
fs.writeFileSync('src/components/ProfileHub.tsx', code);
