const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace("import { Globe, Settings, X } from 'lucide-react';", "import { Globe, Settings, X, Sparkles } from 'lucide-react';");
fs.writeFileSync('src/App.tsx', code);
