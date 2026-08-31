const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetBanner = `        <div className="flex gap-2 border-b border-zinc-800 pb-5 mb-5">
          <input
            type="text"`;

const replaceBanner = `        {isWizardMode && wizardQueue.length > 0 && (
           <div className="bg-gradient-to-r from-red-900/40 to-red-600/20 border border-red-500/50 rounded-xl p-4 mb-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                 <div className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                    Pending Wizard
                 </div>
                 <div className="text-sm font-semibold text-zinc-200">
                    Item {trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).length - wizardQueue.length + 1} of {trendingTMDB.filter(item => !contentList.some(c => String(c.tmdb_id) === String(item.id))).length}
                 </div>
              </div>
              <button 
                 type="button" 
                 onClick={skipWizardItem}
                 className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                 Skip to Next
              </button>
           </div>
        )}
        <div className="flex gap-2 border-b border-zinc-800 pb-5 mb-5">
          <input
            type="text"`;

code = code.replace(targetBanner, replaceBanner);

const targetPopup = `      {adminTab === 'trash' && (`;

const replacePopup = `      {/* Flash Popup for Wizard */}
      <AnimatePresence>
        {flashPopupItem && flashCountdown > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-[999] bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition border border-red-500/50 overflow-hidden"
            onClick={startWizard}
          >
             <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
             <div className="w-12 h-16 rounded overflow-hidden shrink-0 bg-black relative z-10 border border-zinc-700">
                <img src={flashPopupItem.poster_path ? \`https://image.tmdb.org/t/p/w200\${flashPopupItem.poster_path}\` : ''} alt="Poster" className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10">
                <h4 className="font-bold text-sm text-red-500">New Pending Content</h4>
                <p className="text-xs text-zinc-300 line-clamp-1 max-w-[200px]">{flashPopupItem.title || flashPopupItem.name}</p>
                <div className="mt-2 text-[10px] font-bold bg-red-600 text-white w-fit px-2 py-1 rounded shadow">
                   Click to Add Links (\${flashCountdown}s)
                </div>
             </div>
             <button onClick={(e) => { e.stopPropagation(); setFlashPopupItem(null); setFlashDismissed(true); }} className="absolute top-2 right-2 text-zinc-400 hover:text-white z-20 bg-zinc-900 rounded-full p-0.5">
               <X className="w-4 h-4" />
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {adminTab === 'trash' && (`;

code = code.replace(targetPopup, replacePopup);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Added UI components");
