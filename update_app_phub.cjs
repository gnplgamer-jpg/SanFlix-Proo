const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importStr = `import { TrendingVideos } from './components/TrendingVideos';`;
const newImportStr = `import { TrendingVideos } from './components/TrendingVideos';
import { PhubAPIContent } from './components/PhubAPIContent';`;
code = code.replace(importStr, newImportStr);

const renderStr = `                  {/* Porn Hub Network Channel */}
                  {phubContent.length > 0 && isPHubEnabled && (
                    <div className="px-0 mb-6">`;
                    
const newRenderStr = `                  {/* Porn Hub Network Channel */}
                  {isPHubEnabled && (
                    <PhubAPIContent onPlayUrl={(url, title) => {
                      setGlobalVideo({
                        url,
                        movie: { title } as any,
                        showLanguageSelector: false,
                        showQualitySelector: false,
                        showEpisodeSelector: false,
                        fallbackUrls: []
                      });
                    }} />
                  )}
                  {phubContent.length > 0 && isPHubEnabled && (
                    <div className="px-0 mb-6">`;

code = code.replace(renderStr, newRenderStr);

fs.writeFileSync('src/App.tsx', code);
