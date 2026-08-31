const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetFn = `  const scourCatalogTMDbApi = async () => {
    if (!tmdbQuery.trim() && !formData.tmdb_id.trim()) {`;

const replaceFn = `  const scourCatalogTMDbApi = async (directQuery?: string) => {
    const activeQuery = directQuery || tmdbQuery || formData.tmdb_id;
    if (!activeQuery || !activeQuery.trim()) {`;

code = code.replace(targetFn, replaceFn);

const targetFn2 = `let rawQuery = (tmdbQuery || formData.tmdb_id).trim();`;
const replaceFn2 = `let rawQuery = activeQuery.trim();`;
code = code.replace(targetFn2, replaceFn2);

const targetBtn = `                           <button onClick={() => {
                              setFormData({ ...initialForm, tmdb_id: item.id.toString(), title: item.title || item.name || '', release_date: item.release_date || item.first_air_date || '' });
                              setTmdbQuery(item.id.toString());
                              setAdminTab('content');
                              window.scrollTo(0, 0);
                           }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg w-full mt-2">
                             Add as Upcoming / Release
                           </button>`;

const replaceBtn = `                           <button onClick={() => {
                              setFormData({ ...initialForm, tmdb_id: item.id.toString(), title: item.title || item.name || '', release_date: item.release_date || item.first_air_date || '' });
                              setTmdbQuery(item.id.toString());
                              setAdminTab('content');
                              window.scrollTo(0, 0);
                              setTimeout(() => {
                                 scourCatalogTMDbApi(item.id.toString());
                              }, 100);
                           }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg w-full mt-2">
                             Add as Upcoming / Release
                           </button>`;

code = code.replace(targetBtn, replaceBtn);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Updated auto fetch");
