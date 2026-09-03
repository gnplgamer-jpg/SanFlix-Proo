const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  /const matchesSearch = \(item\.title \|\| undefined\)\.toLowerCase\(\)\.includes\(contentSearchTerm\.toLowerCase\(\)\);/g,
  'const matchesSearch = (item.title || "").toLowerCase().includes((contentSearchTerm || "").toLowerCase());'
);

code = code.replace(
  /const isImdb = \/\^tt\\d\+\$\/\.test\(queryValue\.toLowerCase\(\)\);/g,
  'const isImdb = /^tt\\\\d+$/.test((queryValue || "").toLowerCase());'
);

code = code.replace(
  /const findRes = await fetch\(\`\/api\/meta-data\/find\/\$\{queryValue\.trim\(\)\.toLowerCase\(\)\}\`\);/g,
  'const findRes = await fetch(`/api/meta-data/find/${(queryValue || "").trim().toLowerCase()}`);'
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("AdminPanel fixed");
