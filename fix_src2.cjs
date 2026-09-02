const fs = require('fs');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find any src={something} and ensure it has a fallback if it evaluates to empty string
  // It's tricky to do blindly, but we can look for specific bad patterns:
  // e.g. src={... || ''} -> src={... || undefined}
  code = code.replace(/\|\|\s*['"]['"]/g, '|| undefined');
  
  // Or maybe there are some variables without fallback
  
  fs.writeFileSync(file, code);
});

console.log('Fixed src fallbacks in all files');
