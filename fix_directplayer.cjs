const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const target1 = `  onShowQualitySelector: () => void;
  onShowLanguageSelector: () => void;
  hasLanguages: boolean;
  hasQualities: boolean;`;

const replacement1 = `  onShowQualitySelector: () => void;
  onShowLanguageSelector: () => void;
  onShowEpisodeSelector?: () => void;
  hasLanguages: boolean;
  hasQualities: boolean;
  hasEpisodes?: boolean;`;

code = code.replace(target1, replacement1);

const target2 = `  onShowQualitySelector,
  onShowLanguageSelector,
  hasLanguages,
  hasQualities,`;

const replacement2 = `  onShowQualitySelector,
  onShowLanguageSelector,
  onShowEpisodeSelector,
  hasLanguages,
  hasQualities,
  hasEpisodes,`;

code = code.replace(target2, replacement2);

const target3 = `                 {hasLanguages && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowLanguageSelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold hidden sm:inline">Lang</span>
                    </button>
                 )}`;

const replacement3 = `                 {hasEpisodes && onShowEpisodeSelector && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowEpisodeSelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Play className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold hidden sm:inline">Eps</span>
                    </button>
                 )}
                 {hasLanguages && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowLanguageSelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold hidden sm:inline">Lang</span>
                    </button>
                 )}`;

code = code.replace(target3, replacement3);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
