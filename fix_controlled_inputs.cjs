const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Replace || undefined with || ""
code = code.replace(/\|\| undefined\}/g, '|| ""}');
// Also find and replace any place where value={formData.something} without || "" to value={formData.something || ""}
// But simpler: just replace `value={shopForm.price || undefined}` and `value={ep.url_2 || undefined}` first because these explicitly passed undefined.

const findUndefineds = /value=\{([^}]+) \|\| undefined\}/g;
code = code.replace(findUndefineds, 'value={$1 || ""}');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Inputs fixed");
