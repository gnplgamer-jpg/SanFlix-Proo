const fs = require('fs');
let code = fs.readFileSync('src/components/SubscriptionModal.tsx', 'utf8');

// Change isVerifying to track 'verifying', 'success', 'failed' state maybe?
// Wait, I can just add `const [verifySuccess, setVerifySuccess] = useState(false);`

if (!code.includes('verifySuccess')) {
  code = code.replace('const [isVerifying, setIsVerifying] = useState(false);', 'const [isVerifying, setIsVerifying] = useState(false);\n  const [verifySuccess, setVerifySuccess] = useState(false);\n  const [successCountdown, setSuccessCountdown] = useState(10);');
  
  // Replace handleVerify success logic
  const oldSuccess = `if (data.valid) {
          // Success
          setTimeout(() => {
             onSubscribe(checkoutPlan);
          }, 1500);
       }`;
  const newSuccess = `if (data.valid) {
          setIsVerifying(false);
          setVerifySuccess(true);
          let countdown = 10;
          setSuccessCountdown(countdown);
          const interval = setInterval(() => {
             countdown -= 1;
             setSuccessCountdown(countdown);
             if (countdown <= 0) {
                clearInterval(interval);
                onSubscribe(checkoutPlan);
             }
          }, 1000);
       }`;
  code = code.replace(oldSuccess, newSuccess);
  
  // Add verifySuccess UI
  const verifyUI = `
                 {isVerifying ? (
                    <div className="flex items-center gap-3 text-[#60bb46] font-bold text-lg">
                      <ScanLine className="w-6 h-6 animate-pulse" />
                      <span>AI Verifying Slip...</span>
                    </div>
                 ) : verifySuccess ? (
                    <div className="flex flex-col items-center gap-2 text-[#60bb46] font-bold">
                      <div className="w-12 h-12 bg-[#60bb46]/20 rounded-full flex items-center justify-center animate-bounce">
                         <Check className="w-6 h-6 text-[#60bb46]" />
                      </div>
                      <span className="text-xl">Verification Successful!</span>
                      <span className="text-zinc-400 text-sm font-normal">Activating premium in {successCountdown} seconds...</span>
                    </div>
                 ) : (
                    <button 
                      onClick={handleVerify}
                      className="w-full bg-[#60bb46] hover:bg-[#52a33b] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(96,187,70,0.4)] transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Submit for Verification
                    </button>
                 )}
  `;
  
  // Replace the old block
  const oldBlockRegex = /\{isVerifying \? \([\s\S]*?Submit for Verification\s*<\/button>\s*\)\}/m;
  code = code.replace(oldBlockRegex, verifyUI);
  
  fs.writeFileSync('src/components/SubscriptionModal.tsx', code);
  console.log('Patched for 10s success state');
}
