const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStr = `                          if (confirm('Are you sure you want to delete this product?')) {
                            await deleteDoc(doc(db, 'products', prod.id));
                          }`;

const newStr = `                          // Direct delete as confirm() may be blocked in iframe
                          await deleteDoc(doc(db, 'products', prod.id));`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
