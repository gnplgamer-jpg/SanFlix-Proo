const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStr = `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Product Title *</label>
                  <input type="text" value={shopForm.title} onChange={e => setShopForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL</label>
                  <input type="text" value={shopForm.imageUrl} onChange={e => setShopForm(prev => ({ ...prev, imageUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                  <select value={shopForm.category || 'General'} onChange={e => setShopForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white">
                    <option value="General">General</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Daraz Affiliate URL *</label>
                  <input type="url" value={shopForm.affiliateUrl} onChange={e => setShopForm(prev => ({ ...prev, affiliateUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
              </div>
              
              {shopForm.imageUrl && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Image Preview</label>
                  <div className="w-32 h-32 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950 flex items-center justify-center">
                    <img src={shopForm.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image'; }} />
                  </div>
                </div>
              )}`;

const replaceStr = `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Product Title *</label>
                  <input type="text" value={shopForm.title} onChange={e => setShopForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL</label>
                    <input type="text" value={shopForm.imageUrl} onChange={e => setShopForm(prev => ({ ...prev, imageUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" />
                  </div>
                  {shopForm.imageUrl && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-zinc-400 mb-2">Image Preview</label>
                      <div className="w-32 h-32 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950 flex items-center justify-center">
                        <img src={shopForm.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image'; }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                  <select value={shopForm.category || 'General'} onChange={e => setShopForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white">
                    <option value="General">General</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Daraz Affiliate URL *</label>
                  <input type="url" value={shopForm.affiliateUrl} onChange={e => setShopForm(prev => ({ ...prev, affiliateUrl: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-700 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none text-white" required />
                </div>
              </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
