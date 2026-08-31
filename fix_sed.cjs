const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// The regex to replace pairs of `      </div>\n      </div>` with `      </div>`
while (content.includes('      </div>\n      </div>')) {
  content = content.replace(/      <\/div>\n      <\/div>/g, '      </div>');
}

fs.writeFileSync('src/components/SpinnerPage.tsx', content);
