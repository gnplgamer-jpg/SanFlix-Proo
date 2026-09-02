const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const regex = /catch \(err: any\) \{\s*console\.error\(err\);\s*setError\(err\.message \|\| 'Failed to sign in with Google'\);\s*\}/g;

const replacement = `catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AuthModal.tsx', code);
console.log('Fixed auth modal');
