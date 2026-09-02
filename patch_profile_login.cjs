const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHub.tsx', 'utf8');

// Update Interface
if (!code.includes('onLoginClick?: () => void;')) {
  code = code.replace('onLogout?: () => void;', 'onLogout?: () => void;\n  onLoginClick?: () => void;');
}
if (!code.includes('onLoginClick\n}: ProfileHubProps) {') && !code.includes('onLoginClick,')) {
  code = code.replace('onLogout\n}: ProfileHubProps) {', 'onLogout,\n  onLoginClick\n}: ProfileHubProps) {');
}

// Update the Sign In button
code = code.replace(
  /<button onClick=\{\(\) => onChangeTab\('home'\)\} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors text-sm shadow-\[0_0_15px_rgba\(220,38,38,0\.3\)\]">\s*Sign In \/ Register\s*<\/button>/m,
  `<button onClick={onLoginClick} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">
    Sign In / Register
  </button>`
);

fs.writeFileSync('src/components/ProfileHub.tsx', code);
console.log('Patched ProfileHub.tsx with onLoginClick');
