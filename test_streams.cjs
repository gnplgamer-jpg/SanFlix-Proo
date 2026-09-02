const axios = require('axios');

async function test(url) {
  try {
    const res = await axios.head(url, { timeout: 2000 });
    console.log(url, res.status);
  } catch (e) {
    console.log(url, 'FAILED', e.message);
  }
}

test('https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8');
test('https://live.republicworld.com/live/republic/playlist.m3u8');
test('https://ndtvindia.akamaized.net/hls/live/2042296/ndtvindia/master.m3u8');
test('https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8');
