const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf-8');

const targetBtn = `                 {hasQualities && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowQualitySelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold hidden sm:inline">Quality</span>
                    </button>
                 )}`;

const replaceBtn = `                 {hasQualities && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onShowQualitySelector(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold hidden sm:inline">Quality</span>
                    </button>
                 )}
                 {onReport && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (!isLocked) onReport(); }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition shadow-lg border border-white/10 flex items-center gap-2 px-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold hidden sm:inline">Report Error</span>
                    </button>
                 )}`;

code = code.replace(targetBtn, replaceBtn);

const targetImport = `import { Play, Pause, Settings, X, FastForward, Rewind, Maximize, Sun, Volume2, VolumeX, Globe, Loader2, MonitorPlay, Lock, Unlock, RotateCw, Timer, Smartphone, ArrowLeft, Cast, Wand2 } from 'lucide-react';`;
const replaceImport = `import { Play, Pause, Settings, X, FastForward, Rewind, Maximize, Sun, Volume2, VolumeX, Globe, Loader2, MonitorPlay, Lock, Unlock, RotateCw, Timer, Smartphone, ArrowLeft, Cast, Wand2, AlertCircle } from 'lucide-react';`;
code = code.replace(targetImport, replaceImport);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
