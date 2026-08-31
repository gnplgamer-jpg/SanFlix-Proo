const fs = require('fs');

// 1. metadata.json
let meta = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
meta.name = 'SanFlix-Pro';
fs.writeFileSync('metadata.json', JSON.stringify(meta, null, 2));

// 2. capacitor.config.json
if (fs.existsSync('capacitor.config.json')) {
  let cap = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
  cap.appName = 'SanFlix-Pro';
  fs.writeFileSync('capacitor.config.json', JSON.stringify(cap, null, 2));
}

// 3. index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<title>.*?<\/title>/, '<title>SanFlix-Pro</title>');
fs.writeFileSync('index.html', html);

// 4. vite.config.ts
let vite = fs.readFileSync('vite.config.ts', 'utf8');
vite = vite.replace(/name: 'SanFlix Pro'/g, "name: 'SanFlix-Pro'");
vite = vite.replace(/short_name: 'SanFlix'/g, "short_name: 'SanFlix-Pro'");
fs.writeFileSync('vite.config.ts', vite);

console.log('Names patched');
