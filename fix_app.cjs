const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// fix touchStartX
code = code.replace(
  /e\.currentTarget\.dataset\.touchStartX = touch\.clientX;/g,
  "e.currentTarget.dataset.touchStartX = touch.clientX.toString();"
);

code = code.replace(
  /e\.currentTarget\.dataset\.touchStartY = touch\.clientY;/g,
  "e.currentTarget.dataset.touchStartY = touch.clientY.toString();"
);

// fix initialTime
code = code.replace(
  /fallbackUrls\?: string\[\];/g,
  "fallbackUrls?: string[];\n    initialTime?: number;"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx");
