const fs = require('fs');

// Update data.ts
let dataFile = fs.readFileSync('src/data.ts', 'utf-8');
dataFile = dataFile.replace(
  "{ id: '4', name: '🔥 18+ Hub', isSpecial: true },",
  "{ id: '4', name: '🔥 18+ Hub', isSpecial: true },\n  { id: '6', name: 'Porn Hub', isSpecial: true },"
);
fs.writeFileSync('src/data.ts', dataFile);

// Update AdminPanel.tsx
let adminFile = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
adminFile = adminFile.replace(
  'const adultCategories = ["ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films"];',
  'const adultCategories = ["ULLU", "KOOKU", "PRIMESHOTS", "CHULLTV", "HOTX VIP", "DESIFLIX", "Hot web series", "Mms viral video", "Short Films", "Porn Hub"];'
);
fs.writeFileSync('src/components/AdminPanel.tsx', adminFile);

