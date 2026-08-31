const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// 1. Add states
const stateTarget = `  const [reports, setReports] = useState<any[]>([]);`;
const stateReplace = `  const [reports, setReports] = useState<any[]>([]);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [editingShopId, setEditingShopId] = useState<string | null>(null);`;
code = code.replace(stateTarget, stateReplace);

// 2. Add useEffect subscription
const effectTarget = `      const rq = query(collection(db, 'SanFlix_Reports'));
      unsubsReports = onSnapshot(rq, (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });`;
const effectReplace = `      const rq = query(collection(db, 'SanFlix_Reports'));
      unsubsReports = onSnapshot(rq, (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } catch(e) {}
    
    let unsubsShop = () => {};
    try {
      const sq = query(collection(db, 'products'));
      unsubsShop = onSnapshot(sq, (snapshot) => {
        setShopProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });`;
code = code.replace(effectTarget, effectReplace);

// 3. Update return in useEffect
const returnTarget = `return () => { unsubscribe(); unsubsReports(); };`;
const returnReplace = `return () => { unsubscribe(); unsubsReports(); unsubsShop(); };`;
code = code.replace(returnTarget, returnReplace);

// 4. Replace adminTab === 'shop' UI
const shopUiTarget = `      {adminTab === 'shop' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-8 relative">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><ShoppingBag className="w-5 h-5 text-red-500" /> Add Affiliate Product</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!shopForm.title || !shopForm.affiliateUrl) { alert("Title and Affiliate URL required!"); return; }
            setSubmitLoading(true);
            try {
              await addDoc(collection(db, 'products'), shopForm);
              setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });
              alert("Product Added Successfully!");
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSubmitLoading(false);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button type="submit" disabled={submitLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center">
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Product'}
            </button>
          </form>
        </div>
      ) : adminTab === 'reports' ? (`

const shopUiReplace = `      {adminTab === 'shop' ? (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <ShoppingBag className="w-5 h-5 text-red-500" /> {editingShopId ? 'Edit Affiliate Product' : 'Add Affiliate Product'}
              </h3>
              {editingShopId && (
                <button 
                  onClick={() => {
                    setEditingShopId(null);
                    setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });
                  }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!shopForm.title || !shopForm.affiliateUrl) { alert("Title and Affiliate URL required!"); return; }
              setSubmitLoading(true);
              try {
                if (editingShopId) {
                  await updateDoc(doc(db, 'products', editingShopId), shopForm);
                  alert("Product Updated Successfully!");
                  setEditingShopId(null);
                } else {
                  await addDoc(collection(db, 'products'), shopForm);
                  alert("Product Added Successfully!");
                }
                setShopForm({ title: '', imageUrl: '', affiliateUrl: '', category: 'General' });
              } catch (err: any) {
                setError(err.message);
              } finally {
                setSubmitLoading(false);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              )}
              
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <button type="submit" disabled={submitLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center">
                {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingShopId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-white">Manage Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {shopProducts.map((prod) => (
                  <div key={prod.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex flex-col">
                    <div className="h-32 bg-black rounded-md overflow-hidden mb-3 relative flex items-center justify-center p-2">
                       {prod.imageUrl ? (
                         <img src={prod.imageUrl} alt={prod.title} className="max-w-full max-h-full object-contain" />
                       ) : (
                         <span className="text-zinc-600 text-xs">No Image</span>
                       )}
                       <div className="absolute top-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-zinc-300">
                         {prod.category || 'General'}
                       </div>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-3 flex-1">{prod.title}</h4>
                    <div className="flex items-center gap-2 mt-auto">
                      <button 
                        onClick={() => {
                          setEditingShopId(prod.id);
                          setShopForm({
                            title: prod.title || '',
                            imageUrl: prod.imageUrl || '',
                            affiliateUrl: prod.affiliateUrl || '',
                            category: prod.category || 'General'
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1.5 rounded flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            await deleteDoc(doc(db, 'products', prod.id));
                          }
                        }}
                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-500 text-xs font-medium py-1.5 rounded flex items-center justify-center gap-1 border border-red-900/50"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
               ))}
               {shopProducts.length === 0 && (
                 <div className="col-span-full py-8 text-center text-zinc-500 text-sm">
                   No products found.
                 </div>
               )}
            </div>
          </div>
        </div>
      ) : adminTab === 'reports' ? (`

code = code.replace(shopUiTarget, shopUiReplace);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
