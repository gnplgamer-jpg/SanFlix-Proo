const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerModal.tsx', 'utf-8');

const targetImport = `import { Play, Download, ExternalLink, X, Lock, Zap, Youtube, Star, ShieldAlert, MonitorPlay, Smartphone, Globe, Settings, ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { db, collection, getDocs, query, where, limit } from '../firebase';`;

const replaceImport = `import { Play, Download, ExternalLink, X, Lock, Zap, Youtube, Star, ShieldAlert, MonitorPlay, Smartphone, Globe, Settings, ArrowLeft, Calendar, Share2, AlertCircle } from 'lucide-react';
import { db, collection, getDocs, query, where, limit, addDoc } from '../firebase';`;

code = code.replace(targetImport, replaceImport);

const targetShare = `                <motion.button 
                  onClick={handleShare}`;

const replaceShare = `                <button 
                  onClick={async () => {
                     try {
                        await addDoc(collection(db, 'SanFlix_Reports'), {
                          movieId: movie.firebase_id || movie.id,
                          movieTitle: movie.title,
                          episodeTitle: '',
                          failedUrl: movie.streaming_link_1 || '',
                          timestamp: new Date().toISOString(),
                          resolved: false
                        });
                        alert('Broken link reported to admin. We will fix it shortly!');
                     } catch(err) {
                        alert('Failed to report.');
                     }
                  }}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-red-500/30 overflow-hidden relative"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" /> Report Broken Link
                </button>
                <motion.button 
                  onClick={handleShare}`;

code = code.replace(targetShare, replaceShare);

fs.writeFileSync('src/components/PlayerModal.tsx', code);
