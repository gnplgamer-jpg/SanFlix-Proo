const fs = require('fs');
let code = fs.readFileSync('src/components/DirectVideoPlayer.tsx', 'utf8');

if (!code.includes('isPremium?: boolean;')) {
   code = code.replace('interface DirectVideoPlayerProps {', 'interface DirectVideoPlayerProps {\n  isPremium?: boolean;\n  onRequirePremium?: () => void;');
}

if (!code.includes('onRequirePremium,')) {
   code = code.replace('onShowEpisodeSelector,\n  hasLanguages,', 'onShowEpisodeSelector,\n  hasLanguages,\n  isPremium = false,\n  onRequirePremium,');
}

// Modify handleApplyFilter
const filterApplyRegex = /const handleApplyFilter = \(filter: any\) => {[\s\S]*?};/m;
const newFilterApply = `const handleApplyFilter = (filter: any) => {
    if (filter.name !== 'Original' && !isPremium) {
       setShowVisualEnhancerPanel(false);
       if (onRequirePremium) onRequirePremium();
       return;
    }
    setVisualEnhancer(filter.name);
    setShowVisualEnhancerPanel(false);
  };`;
code = code.replace(filterApplyRegex, newFilterApply);

fs.writeFileSync('src/components/DirectVideoPlayer.tsx', code);
console.log('Patched DirectVideoPlayer.tsx for premium');
