const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const submitTarget = `      setFormData(initialForm);
      setTmdbQuery('');
      // fetchContent removed
      setError(null);`;

const submitReplace = `      setFormData(initialForm);
      setTmdbQuery('');
      // fetchContent removed
      setError(null);
      
      if (isWizardMode) {
        if (wizardQueue.length > 1) {
          const nextQueue = wizardQueue.slice(1);
          setWizardQueue(nextQueue);
          window.scrollTo(0, 0);
          setTimeout(() => scourCatalogTMDbApi(nextQueue[0].id.toString()), 100);
        } else {
          setIsWizardMode(false);
          setWizardQueue([]);
        }
      }`;

code = code.replace(submitTarget, submitReplace);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Updated Wizard submit");
