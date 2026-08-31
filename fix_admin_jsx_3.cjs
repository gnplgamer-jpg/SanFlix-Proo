const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// The block starts near line 390
const lines = code.split('\n');

// Let's find exactly where we inserted {adminTab === 'reports' ?
let foundTernary = false;
let replaceStartIndex = -1;
let replaceEndIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{adminTab === 'reports' ? (")) {
    foundTernary = true;
  }
  if (lines[i] === "      ) : (") {
     lines[i] = "      ) : ( <>";
  }
  
  if (lines[i].includes("{/* Floating Bulk Action Bar */}")) {
     // The line before this is likely )} closing the ternary
     if (lines[i-1].includes(")}")) {
       lines[i-1] = "      </>)}";
     }
  }
}

fs.writeFileSync('src/components/AdminPanel.tsx', lines.join('\n'));
