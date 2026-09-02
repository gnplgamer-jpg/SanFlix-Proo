const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes("@capacitor/local-notifications")) {
  content = content.replace(/import \{ Capacitor \} from '@capacitor\/core';/, "import { Capacitor } from '@capacitor/core';\nimport { LocalNotifications } from '@capacitor/local-notifications';");
}

const notifLogic = `
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      LocalNotifications.requestPermissions().then((res) => {
        if (res.display === 'granted') {
          // Schedule a stylish notification
          LocalNotifications.schedule({
            notifications: [
              {
                title: "🎬 New Premium Movie Alert!",
                body: "A highly anticipated movie just dropped on SanFlix-Pro. Watch it now in 4K!",
                id: Math.floor(Math.random() * 100000),
                schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 2) }, // In 2 hours
                actionTypeId: "",
                extra: null
              }
            ]
          });
        }
      });
    }
  }, []);
`;

// Insert after the existing useEffects
content = content.replace(/useEffect\(\(\) => \{\n\s*const savedGlobal = localStorage\.getItem\('SANFLIX_GLOBAL_VIDEO'\);/, notifLogic + "\n  useEffect(() => {\n    const savedGlobal = localStorage.getItem('SANFLIX_GLOBAL_VIDEO');");

fs.writeFileSync('src/App.tsx', content);
console.log('patched notifications');
