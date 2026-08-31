const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Add to default state
code = code.replace(/  is_highlighted: false,\n  ad_gate: false,/, "  is_highlighted: false,\n  ad_gate: false,\n  is_sanflix_pro: false,");

// Add to editItem
code = code.replace(/      is_highlighted: item.is_highlighted \|\| false,\n      ad_gate: item.ad_gate \|\| false,/, "      is_highlighted: item.is_highlighted || false,\n      ad_gate: item.ad_gate || false,\n      is_sanflix_pro: item.is_sanflix_pro || false,");

// Add to render inputs
const sanflixProInput = `          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <input type="checkbox" id="sanflixpro" name="is_sanflix_pro" checked={formData.is_sanflix_pro} onChange={handleInputChange} className="rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-zinc-900" />
            <label htmlFor="sanflixpro" className="text-sm text-zinc-300 font-medium">Add to SanFlix-Pro (Premium Content)</label>
          </div>`;

code = code.replace(/          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">\n            <input type="checkbox" id="highlight" name="is_highlighted"/, sanflixProInput + "\n\n          <div className=\"flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800\">\n            <input type=\"checkbox\" id=\"highlight\" name=\"is_highlighted\"");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
