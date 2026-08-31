const https = require('https');

const options = {
  hostname: 'pornhub-api-xnxx.p.rapidapi.com',
  path: '/api/trending?page=1',
  method: 'GET',
  headers: {
    'x-rapidapi-host': 'pornhub-api-xnxx.p.rapidapi.com',
    'x-rapidapi-key': '8ec1489348msh9f97ee5a9a78f85p1c5eafjsnd6b122f32963'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 500)); // Print just the first 500 chars to see the structure
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
