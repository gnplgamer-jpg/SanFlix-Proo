const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// 1. Update initial state
code = code.replace(
  "const [shopForm, setShopForm] = useState({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });",
  "const [shopForm, setShopForm] = useState({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5' });"
);

// 2. Update reset after add/update
code = code.replace(
  "setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });",
  "setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5' });"
);
code = code.replace(
  "setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });",
  "setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General', price: '', rating: '5' });"
);

// 3. Update form inputs to include Price and Rating
const targetInputs = `                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Daraz Affiliate URL *</label>
                  <input type="url" value={shopForm.affiliateUrl} onChange={e => setShopForm(prev => ({ ...prev, affiliateUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
              </div>`;

const newInputs = `                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Daraz Affiliate URL *</label>
                  <input type="url" value={shopForm.affiliateUrl} onChange={e => setShopForm(prev => ({ ...prev, affiliateUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Price</label>
                  <input type="text" placeholder="e.g. Rs. 499" value={shopForm.price || ''} onChange={e => setShopForm(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={shopForm.rating || '5'} onChange={e => setShopForm(prev => ({ ...prev, rating: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
              </div>`;

code = code.replace(targetInputs, newInputs);

// 4. Update edit click handler to populate price and rating
const targetEdit = `                          setShopForm({
                            title: prod.title || '',
                            imageUrl: prod.imageUrl || '',
                            affiliateUrl: prod.affiliateUrl || '',
                            category: prod.category || 'General'
                          });`;

const newEdit = `                          setShopForm({
                            title: prod.title || '',
                            imageUrl: prod.imageUrl || '',
                            affiliateUrl: prod.affiliateUrl || '',
                            category: prod.category || 'General',
                            price: prod.price || '',
                            rating: prod.rating || '5'
                          });`;
code = code.replace(targetEdit, newEdit);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
