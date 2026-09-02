const fs = require('fs');
let code = fs.readFileSync('src/components/ActressRail.tsx', 'utf8');

const regex = /export const predefinedActresses: Actress\[\] = \[\s*\{ name: 'Aliya Naaz'[\s\S]*?\];/;

const newContent = `export const predefinedActresses: Actress[] = [
  { name: 'Aliya Naaz', tmdbId: 3004810, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjYxZjg0ZjQtMzMyYy00NzlmLThiMTItY2YwM2M0NzgyMjc0XkEyXkFqcGc@._V1_UY256_CR20,0,172,256_AL_.jpg' },
  { name: 'Sneha Paul', tmdbId: 3062325, imageUrl: 'https://image.tmdb.org/t/p/w185/9ynw91mnpUAIlHu71W70LiAPZQZ.jpg' },
  { name: 'Disha Patani', tmdbId: 1546398, imageUrl: 'https://image.tmdb.org/t/p/w185/jeFgIW3d3BP6MkfnMlmEGP33Oyq.jpg' },
  { name: 'Nora Fatehi', tmdbId: 1488785, imageUrl: 'https://image.tmdb.org/t/p/w185/jKvLkySOJFUUnUdE7Zo4oPb9ZzM.jpg' },
  { name: 'Shraddha Kapoor', tmdbId: 130991, imageUrl: 'https://image.tmdb.org/t/p/w185/tFx6DRETklfkFIUu5Sl5TCN1gD9.jpg' },
  { name: 'Deepika Padukone', tmdbId: 53975, imageUrl: 'https://image.tmdb.org/t/p/w185/rzvvBQ0r6oiqDdzcsdTRB7jN4Rx.jpg' },
  { name: 'Mrunal Thakur', tmdbId: 1766034, imageUrl: 'https://image.tmdb.org/t/p/w185/4ITqe6SrpQgwUFU52rkmZNffyrM.jpg' },
  { name: 'Kiara Advani', tmdbId: 1340978, imageUrl: 'https://image.tmdb.org/t/p/w185/2xmU03a6kTWUvuTPMdofiFLxdAw.jpg' },
  { name: 'Janhvi Kapoor', tmdbId: 1974970, imageUrl: 'https://image.tmdb.org/t/p/w185/2VqBDc19br9CIitXUFkZ52q7V2o.jpg' },
  { name: 'Pooja Hegde', tmdbId: 587753, imageUrl: 'https://image.tmdb.org/t/p/w185/t09lf8vem5MRk3KaALcdgehreXg.jpg' },
  { name: 'Rashmika Mandanna', tmdbId: 1752056, imageUrl: 'https://image.tmdb.org/t/p/w185/wr60ZDcMfYRPU6IM3PrsaOCw5ZV.jpg' },
  { name: 'Mouni Roy', tmdbId: 1251224, imageUrl: 'https://image.tmdb.org/t/p/w185/bopoygerwuqnt1WaTPULn5izxRQ.jpg' },
  { name: 'Esha Gupta', tmdbId: 1040950, imageUrl: 'https://image.tmdb.org/t/p/w185/zNvRvv4Ifu1kRMzHecSzD3pn62y.jpg' },
  { name: 'Tamannaah Bhatia', tmdbId: 85721, imageUrl: 'https://image.tmdb.org/t/p/w185/t4WYoKiFAyO1Rhjv7O03EKmJHp4.jpg' },
  { name: 'Kriti Sanon', tmdbId: 1285028, imageUrl: 'https://image.tmdb.org/t/p/w185/yYqQBLxsjNw1WXakmbC8WwKoPFs.jpg' },
];`;

code = code.replace(regex, newContent);
fs.writeFileSync('src/components/ActressRail.tsx', code);
console.log('Fixed actresses');
