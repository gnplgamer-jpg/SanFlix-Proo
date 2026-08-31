const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetStr = `      {adminTab === 'shop' ? (
        <div className="space-y-6">`;

const newStr = `      {adminTab === 'trash' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Recycle Bin ({trashContent.length})
            </h2>
          </div>
          {trashContent.length === 0 ? (
            <div className="text-center text-zinc-500 py-10">Trash is empty</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trashContent.map(item => (
                <div key={item.firebase_id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group relative">
                  <div className="relative aspect-[2/3] bg-zinc-800">
                    <img src={item.poster_url || item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-50 grayscale" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => restoreItem(item.firebase_id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg w-3/4">Restore</button>
                      <button onClick={() => { if(window.confirm('Permanently delete this?')) hardDeleteItem(item.firebase_id); }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg w-3/4">Delete Forever</button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">Deleted: {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : adminTab === 'shop' ? (
        <div className="space-y-6">`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
