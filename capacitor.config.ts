import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanflix.app',
  appName: 'SanFlix',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-8551073579787342~9404319474',
    }
  }
};

export default config;
