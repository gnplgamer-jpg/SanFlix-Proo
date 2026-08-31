const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Pass unlockedContent to all MovieRail instances
content = content.replace(/<MovieRail (.*?) \/>/g, '<MovieRail $1 unlockedContent={unlockedContent} />');

// Add CountdownTimer to App.tsx too for Explore grid
const timerComponent = `
const CountdownTimer = ({ expiryTime }: { expiryTime: number }) => {
  const [timeLeft, React.useState] = React.useState(expiryTime - Date.now()); // Fallback for no import

  React.useEffect(() => {
    const interval = setInterval(() => {
      React.useState(expiryTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft <= 0) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg border border-red-400/50 flex items-center gap-1 z-20">
      <Clock className="w-3 h-3 animate-pulse" />
      {hours}h {minutes}m
    </div>
  );
};
`;

// wait, I don't need to add it to App.tsx if I can just use a similar inline thing, or just copy the component.
// But React.useState won't work that way (React.useState returns an array).
// Let's properly add it to App.tsx

fs.writeFileSync('src/App.tsx', content);
