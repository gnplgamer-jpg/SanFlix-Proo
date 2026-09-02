const fs = require('fs');
let code = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

code = code.replace(/src="\/esewa-qr\.jpg"/g, 'src="https://i.ibb.co/0pb2rLWm/esewa-qr.jpg"');

fs.writeFileSync('src/components/SubscriptionModal.tsx', code);
console.log('Updated QR code URL');
