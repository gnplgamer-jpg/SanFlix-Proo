const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  `}        </div>      ) : (      {error && (`,
  `}        </div>      ) : (      <>      {error && (`
);

code = code.replace(
  `        </div>
      )}
      {/* Floating Bulk Action Bar */}`,
  `        </div>
      </>)}
      {/* Floating Bulk Action Bar */}`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
