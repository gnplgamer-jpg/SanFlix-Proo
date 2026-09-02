const fs = require('fs');
let code = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

const regex = /<AnimatePresence>\s*\{showAd && \([\s\S]*?<\/AnimatePresence>/;

const replacement = `<AnimatePresence>
        {showAd && (
          <AdPlayer onAdComplete={() => {
            setShowAd(false);
            if (adPurpose === 'spin') { finishSpin(); }
            else if (adPurpose === 'checkin') { onReward(15); setDailyCheckInClaimed(true); localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true'); }
            else { onReward(20); setTrailerClaimed(true); localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true'); }
          }} />
        )}
      </AnimatePresence>`;

// Only replace the FIRST occurrence (which is the showAd one). 
// Wait, is there another AnimatePresence matching the pattern? 
// The regex matches up to the first </AnimatePresence> it finds after showAd.
code = code.replace(regex, replacement);

fs.writeFileSync('src/components/SpinnerPage.tsx', code);
console.log('Patched SpinnerPage showAd');
