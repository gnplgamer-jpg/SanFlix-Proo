const fs = require('fs');
let content = fs.readFileSync('src/components/SpinnerPage.tsx', 'utf8');

// The error was "The character "}" is not valid inside a JSX element" on line 556.
// Let's count divs manually in the whole return block.
// Or we can just try to compile and check exactly where it is.
