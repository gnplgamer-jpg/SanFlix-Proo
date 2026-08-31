const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

// Replace Firebase auth imports with just what's needed (none really, maybe just icons)
content = content.replace(/import \{ auth, googleProvider, signInWithPopup, signOut \} from '\.\.\/firebase';/g, '');

// Replace handleLogout
content = content.replace(
  /const handleLogout = async \(\) => \{[\s\S]*?\};/g,
  `const handleLogout = () => {
    localStorage.removeItem('sanflix_user');
    window.location.reload();
  };`
);

fs.writeFileSync('src/components/ProfileHub.tsx', content);
