const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('import cors from "cors"')) {
  content = content.replace(/import express from "express";/, 'import express from "express";\nimport cors from "cors";');
}

if (!content.includes('app.use(cors(')) {
  content = content.replace(/app\.use\(express\.json\(\)\);/, 'app.use(cors({ origin: "*" }));\n  app.use(express.json());');
}

fs.writeFileSync('server.ts', content);
console.log('patched server.ts with cors');
