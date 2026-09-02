const fs = require('fs');
let code = fs.readFileSync('src/components/AdBanner.tsx', 'utf8');

// import AD_CONFIG
if (!code.includes("import { AD_CONFIG }")) {
  code = code.replace(
    "import React, { useEffect, useRef } from 'react';",
    "import React, { useEffect, useRef } from 'react';\nimport { AD_CONFIG } from '../config/ads';"
  );
}

// split banner string
code = code.replace(
  'data-ad-client="ca-pub-8551073579787342"',
  'data-ad-client={AD_CONFIG.admob.banner.split("/")[0]}'
);
code = code.replace(
  'data-ad-slot="8283186792"',
  'data-ad-slot={AD_CONFIG.admob.banner.split("/")[1]}'
);

fs.writeFileSync('src/components/AdBanner.tsx', code);
console.log('AdBanner.tsx updated');
