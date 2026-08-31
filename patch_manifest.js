const fs = require('fs');
const path = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(path, 'utf8');

if (!xml.includes('USE_BIOMETRIC')) {
  xml = xml.replace('</manifest>', '    <uses-permission android:name="android.permission.USE_BIOMETRIC" />\n    <uses-permission android:name="android.permission.USE_FINGERPRINT" />\n</manifest>');
}

if (!xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  xml = xml.replace('</application>', '    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-8551073579787342~9404319474"/>\n    </application>');
}

fs.writeFileSync(path, xml);
