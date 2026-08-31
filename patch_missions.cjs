const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

if (!content.includes('CalendarCheck')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, CalendarCheck, Film, CheckCircle } from 'lucide-react';");
}

// Add state for missions
const stateCode = `  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState(false);
  const [trailerClaimed, setTrailerClaimed] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const checkIn = localStorage.getItem('daily_checkin_' + today);
    const trailer = localStorage.getItem('daily_trailer_' + today);
    if (checkIn === 'true') setDailyCheckInClaimed(true);
    if (trailer === 'true') setTrailerClaimed(true);
  }, []);

  const handleClaimCheckIn = () => {
    if (dailyCheckInClaimed) return;
    playSound(clickSound);
    onReward(50);
    setDailyCheckInClaimed(true);
    localStorage.setItem('daily_checkin_' + new Date().toDateString(), 'true');
  };

  const handleClaimTrailer = () => {
    if (trailerClaimed) return;
    playSound(clickSound);
    // Simulating watching trailer
    setShowAd(true);
    setAdTimer(5); // shorter timer for trailer mission
    const handleClose = () => {
      onReward(20);
      setTrailerClaimed(true);
      localStorage.setItem('daily_trailer_' + new Date().toDateString(), 'true');
      setShowAd(false);
      window.removeEventListener('ad_closed', handleClose);
    };
    window.addEventListener('ad_closed', handleClose);
  };
`;
// Wait, the showAd popup doesn't dispatch 'ad_closed'. We should probably just trigger the ad flow.
