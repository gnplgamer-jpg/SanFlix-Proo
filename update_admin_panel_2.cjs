const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Update shopForm state to include description
code = code.replace(
  "const [shopForm, setShopForm] = useState({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5' });",
  "const [shopForm, setShopForm] = useState({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5', description: '' });"
);

code = code.replace(
  /setShopForm\(\{ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5' \}\);/g,
  "setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5', description: '' });"
);

// Add 18+ to category options
code = code.replace(
  '<option value="Accessories">Accessories</option>',
  '<option value="Accessories">Accessories</option>\n                    <option value="18+">18+</option>'
);

// Add Description field
const targetDesc = `                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={shopForm.rating || '5'} onChange={e => setShopForm(prev => ({ ...prev, rating: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
              </div>`;

const newDesc = `                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={shopForm.rating || '5'} onChange={e => setShopForm(prev => ({ ...prev, rating: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                  <textarea rows={3} value={shopForm.description || ''} onChange={e => setShopForm(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" placeholder="Product description..."></textarea>
                </div>
              </div>`;

code = code.replace(targetDesc, newDesc);

// Update Edit function
const targetEdit = `                            category: prod.category || 'General',
                            price: prod.price || '',
                            rating: prod.rating || '5'
                          });`;

const newEdit = `                            category: prod.category || 'General',
                            price: prod.price || '',
                            rating: prod.rating || '5',
                            description: prod.description || ''
                          });`;

code = code.replace(targetEdit, newEdit);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
