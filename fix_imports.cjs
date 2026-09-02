const fs = require('fs');

function addImport(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { BlurImage }")) {
    code = "import { BlurImage } from './BlurImage';\n" + code;
    fs.writeFileSync(file, code);
    console.log('Added to', file);
  }
}

addImport('src/components/Discover.tsx');
addImport('src/components/Movies.tsx');
addImport('src/components/PhubAPIContent.tsx');
addImport('src/components/PlayerModal.tsx');
addImport('src/components/TvShows.tsx');

