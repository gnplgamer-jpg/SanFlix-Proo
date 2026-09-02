const fs = require('fs');
const content = `import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Crown, PlayCircle, Loader2, Sparkles, Shield, Tv, Wand2, Upload, ScanLine, AlertCircle } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (plan: any) => void;
  onWatchAdTrial: () => void;
  onFraudWarning: (message: string) => void;
  trialMode?: boolean;
}

export function SubscriptionModal({ onClose, onSubscribe, onWatchAdTrial, onFraudWarning, trialMode = false }: SubscriptionModalProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<any | null>(null);
  const [uploadedSlip, setUploadedSlip] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plans = [
    { id: '1m', name: '1 Month', price: '₹99', duration: '30 Days', popular: false },
    { id: '3m', name: '3 Months', price: '₹249', duration: '90 Days', popular: false },
    { id: '6m', name: '6 Months', price: '₹399', duration: '180 Days', popular: true },
    { id: '1y', name: '1 Year', price: '₹699', duration: '365 Days', popular: false },
    { id: 'life', name: 'Lifetime', price: '₹1999', duration: 'Forever', popular: false },
  ];

  const handleSubscribe = (plan: any) => {
    setCheckoutPlan(plan);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedSlip(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!uploadedSlip) return;
    setIsVerifying(true);
    
    try {
       const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: uploadedSlip, planId: checkoutPlan.id })
       });
       
       if (!res.ok) {
          throw new Error("Verification failed");
       }
       
       const data = await res.json();
       
       if (data.valid) {
          // Success
          setTimeout(() => {
             onSubscribe(checkoutPlan);
          }, 1500);
       } else {
          // Fake / Invalid
          setIsVerifying(false);
          setUploadedSlip(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          onFraudWarning("You are trying to cheat the Admin! Uploading fake/wrong slips is not allowed.\\nReason: " + (data.reason || "Invalid slip"));
       }
    } catch (err) {
       console.error(err);
       setIsVerifying(false);
       onFraudWarning("Failed to connect to verification server. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(234,179,8,0.15)] flex flex-col lg:flex-row gap-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors z-20">
          <X className="w-5 h-5" />
        </button>

        {!checkoutPlan ? (
          <>
            <div className="flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-[#60bb46]/20 border border-[#60bb46]/30 px-3 py-1.5 rounded-full mb-6 w-fit">
                <Crown className="w-4 h-4 text-[#60bb46]" />
                <span className="text-xs font-bold text-[#60bb46] tracking-wider uppercase">eSewa Premium</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                {trialMode ? 'Your Trial Ended' : 'Unlock Full Power of SanFlix'}
              </h2>
              
              <p className="text-zinc-400 text-sm sm:text-base mb-8">
                Upgrade to Premium to get unlimited access to Live TV channels and unlock all visual HDR effects on the player.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-[#60bb46]/20 p-1.5 rounded-full mt-0.5">
                    <Check className="w-4 h-4 text-[#60bb46]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Unlimited Live TV</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">Stream 24/7 without any 10-minute interruptions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#60bb46]/20 p-1.5 rounded-full mt-0.5">
                    <Wand2 className="w-4 h-4 text-[#60bb46]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">HDR & Visual Effects</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">Access cinematic filters, HDR, and inverted effects on any video.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#60bb46]/20 p-1.5 rounded-full mt-0.5">
                    <Shield className="w-4 h-4 text-[#60bb46]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Ad-Free Experience</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">No sponsor breaks or trial limits ever again.</p>
                  </div>
                </li>
              </ul>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Tv className="w-24 h-24 text-white" />
                 </div>
                 <h4 className="text-white font-bold mb-1 relative z-10">{trialMode ? 'Need more time?' : 'Want to try it first?'}</h4>
                 <p className="text-zinc-400 text-xs mb-4 max-w-[200px] relative z-10">
                   Watch a short ad to get 10 minutes of unlocked Live TV and Effects.
                 </p>
                 <button 
                   onClick={onWatchAdTrial}
                   className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm relative z-10"
                 >
                   <PlayCircle className="w-4 h-4 text-white" />
                   {trialMode ? 'Add 10 Minutes via Ad' : 'Get 10 Mins Trial'}
                 </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSubscribe(plan)}
                    className={\`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group \${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#60bb46]/10 to-[#60bb46]/5 border-[#60bb46] shadow-[0_0_20px_rgba(96,187,70,0.15)]' 
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                    }\`}
                  >
                    {plan.popular && (
                       <div className="absolute top-0 right-0 bg-[#60bb46] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                         Most Popular
                       </div>
                    )}
                    
                    <div className="flex flex-col">
                      <span className={\`font-black text-lg \${plan.popular ? 'text-[#60bb46]' : 'text-white group-hover:text-zinc-200'}\`}>
                        {plan.name}
                      </span>
                      <span className="text-zinc-500 text-xs font-medium">{plan.duration} Access</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-white">{plan.price}</span>
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center transition-colors \${plan.popular ? 'bg-[#60bb46] text-white' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}\`}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-center text-zinc-600 text-[10px] mt-6 px-4">
                By subscribing, you agree to our Terms of Service. Payment will be processed via eSewa.
              </p>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-6">
            <h2 className="text-3xl font-black text-white mb-2 text-center">Complete Payment</h2>
            <p className="text-zinc-400 text-sm mb-6 text-center max-w-md">
              Scan the QR code below using your eSewa app to pay <strong className="text-[#60bb46]">{checkoutPlan.price}</strong> for the <strong>{checkoutPlan.name}</strong> plan.
            </p>
            
            <div className="bg-white p-4 rounded-3xl mb-6 shadow-[0_0_40px_rgba(96,187,70,0.2)]">
               <img src="/esewa-qr.jpg" alt="eSewa QR Code" className="w-48 h-48 object-contain rounded-2xl" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; }} />
            </div>

            {!uploadedSlip ? (
              <div className="w-full max-w-sm">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-[#60bb46] text-zinc-300 hover:text-white font-bold py-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"
                >
                  <Upload className="w-8 h-8 text-zinc-500" />
                  <span>Upload Payment Slip / Screenshot</span>
                  <span className="text-xs text-zinc-500 font-normal">JPG, PNG up to 10MB</span>
                </button>
                <button onClick={() => setCheckoutPlan(null)} className="w-full mt-4 text-zinc-500 text-sm hover:text-white transition-colors">
                  Go Back
                </button>
              </div>
            ) : (
              <div className="w-full max-w-sm flex flex-col items-center">
                 <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-700 mb-6 group">
                   <img src={uploadedSlip} alt="Uploaded Slip" className="w-full h-48 object-cover opacity-80" />
                   
                   {isVerifying && (
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-[#60bb46] shadow-[0_0_20px_#60bb46]"
                      />
                   )}
                   
                   {!isVerifying && (
                     <button onClick={() => setUploadedSlip(null)} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-600 transition-colors">
                       <X className="w-4 h-4" />
                     </button>
                   )}
                 </div>

                 {isVerifying ? (
                    <div className="flex items-center gap-3 text-[#60bb46] font-bold text-lg">
                      <ScanLine className="w-6 h-6 animate-pulse" />
                      <span>AI Verifying Slip...</span>
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
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/SubscriptionModal.tsx', content);
console.log('Replaced SubscriptionModal.tsx');
