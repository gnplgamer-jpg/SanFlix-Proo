const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetPhubImg = `                              <img
                                src={movie.poster_url || movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />`;

const newPhubImg = `                              <img
                                src={movie.poster_url || movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                loading="lazy"
                              />`;

code = code.replace(targetPhubImg, newPhubImg);

fs.writeFileSync('src/App.tsx', code);
