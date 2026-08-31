const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                  if (progressData[movieId]) {
                    initialTime = progressData[movieId].currentTime;
                  }`;
const newStr = `                  if (progressData[movieId] && progressData[movieId].url === url) {
                    initialTime = progressData[movieId].currentTime;
                  }`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/App.tsx', code);
